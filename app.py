from flask import Flask, request, jsonify
import requests, json, os, time

app = Flask(__name__)

# ====================================================
#  RAD Ledger Backend — Payment + Webhook + Submissions
# ====================================================

# Xaman (XUMM / Xaman) API credentials
API_KEY = "2a4001ce-0a75-42bc-8bd2-8ef096ac26d4"
API_SECRET = "7c508def-83b7-41c9-b4a1-2c82da1d6a79"
HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "x-api-secret": API_SECRET
}

LEDGER_FILE      = "/var/www/radgarlington.io/ledger.json"
SUBMISSIONS_FILE = "/var/www/radgarlington.io/submissions.json"


# ---------- Utility Functions (Ledger) ----------

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_ledger(data):
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ---------- Utility Functions (Submissions) ----------

def load_submissions():
    if not os.path.exists(SUBMISSIONS_FILE):
        return []
    try:
        with open(SUBMISSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        # If corrupted, start clean (you can harden this later)
        return []


def save_submissions(data):
    tmp_path = SUBMISSIONS_FILE + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp_path, SUBMISSIONS_FILE)


# ---------- Routes ----------

@app.route("/create_payload", methods=["POST"])
def create_payload():
    """
    Create a Xaman payment payload for RAD Ledger certification
    """
    data = request.get_json(force=True)
    amount_xrp = data.get("amount", 5)
    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu",  # your live treasury wallet
            "Amount": str(int(float(amount_xrp) * 1_000_000))
        },
        "custom_meta": {
            "instruction": f"RAD Ledger certification payment: {project}",
            "identifier": project
        },
        "options": {
            "return_url": {"web": "https://radgarlington.io/ledger.html"}
        }
    }

    try:
        resp = requests.post(
            "https://xumm.app/api/v1/platform/payload",
            headers=HEADERS,
            json=payload
        )
        resp.raise_for_status()
        payload_resp = resp.json()
        return jsonify({
            "uuid":   payload_resp.get("uuid"),
            "next":   payload_resp.get("next"),
            "refs":   payload_resp.get("refs"),
            "project": project,
            "issuer":  issuer
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/webhook", methods=["POST"])
def webhook():
    """
    Receive webhook callbacks from Xaman when a payment is signed & confirmed.
    Automatically logs new Certified entries to ledger.json.
    """
    data = request.get_json(force=True)
    if not data or "payloadResponse" not in data:
        return "invalid", 400

    tx = data["payloadResponse"]
    if tx.get("signed") and tx.get("dispatched"):
        project = tx["custom_meta"]["identifier"]
        new_entry = {
            "project":      project,
            "issuer":       tx["response"]["account"],
            "status":       "Certified",
            "ledger_index": tx.get("txid", "pending"),
            "cert_number":  "XRPL589"
        }
        ledger = load_ledger()
        ledger.append(new_entry)
        save_ledger(ledger)
        return "ok", 200

    return "ignored", 200


@app.route("/api/submit-token", methods=["POST"])
def api_submit_token():
    """
    Log RAD Ledger submission details into submissions.json
    """
    try:
        payload = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"ok": False, "error": "Invalid JSON payload"}), 400

    developer  = (payload.get("developer") or "").strip()
    email      = (payload.get("email") or "").strip()
    token_name = (payload.get("token_name") or "").strip()
    issuer     = (payload.get("issuer") or "").strip()

    if not developer or not email or not token_name or not issuer:
        return jsonify({"ok": False, "error": "Missing required fields"}), 400

    entry = {
        "tier":            (payload.get("tier") or "").strip(),
        "developer":       developer,
        "developer_x":     (payload.get("developer_x") or "").strip(),
        "token_name":      token_name,
        "token_symbol":    (payload.get("token_symbol") or "").strip(),
        "issuer":          issuer,
        "website":         (payload.get("website") or "").strip(),
        "email":           email,
        "project_twitter": (payload.get("project_twitter") or "").strip(),
        "telegram":        (payload.get("telegram") or "").strip(),
        "seal_nft":        (payload.get("seal_nft") or "").strip(),
        "submitted_at":    time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    submissions = load_submissions()
    submissions.append(entry)
    save_submissions(submissions)

    return jsonify({"ok": True})


# ---------- Main ----------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
