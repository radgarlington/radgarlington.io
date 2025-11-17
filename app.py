from flask import Flask, request, jsonify
import requests, json, os
from datetime import datetime, timezone

app = Flask(__name__)

# ====================================================
#  RAD Ledger Backend — Payment + Webhook + Submissions
# ====================================================

# Xaman (XUMM) API credentials
API_KEY = "2a4001ce-0a75-42bc-8bd2-8ef096ac26d4"
API_SECRET = "7c508def-83b7-41c9-b4a1-2c82da1d6a79"
HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "x-api-secret": API_SECRET,
}

LEDGER_FILE = "/var/www/radgarlington.io/ledger.json"
SUBMISSIONS_FILE = "/var/www/radgarlington.io/submissions.json"


# ---------- Utility Functions ----------

def load_json(path, default):
    """
    Safe JSON loader with fallback.
    """
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            return default
    return default


def save_json(path, data):
    """
    Safe JSON writer.
    """
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def load_ledger():
    return load_json(LEDGER_FILE, [])


def save_ledger(data):
    save_json(LEDGER_FILE, data)


# ---------- API: Form Submissions ----------

@app.route("/api/submit-token", methods=["POST"])
def submit_token():
    """
    Receive form submissions from submit.html and log them into submissions.json
    BEFORE payment is attempted.
    """
    try:
        payload = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"ok": False, "error": "invalid_json"}), 400

    # Core required fields for any tier
    required = ["tier", "token_name", "issuer", "email"]
    missing = [field for field in required if not payload.get(field)]
    if missing:
        return jsonify({
            "ok": False,
            "error": "missing_fields",
            "fields": missing,
        }), 400

    submissions = load_json(SUBMISSIONS_FILE, [])

    entry = {
        "tier": payload.get("tier"),
        "developer": payload.get("developer") or "",
        "developer_x": payload.get("developer_x") or "",
        "token_name": payload.get("token_name"),
        "token_symbol": payload.get("token_symbol") or "",
        "issuer": payload.get("issuer"),
        "website": payload.get("website") or "",
        "email": payload.get("email"),
        "project_twitter": payload.get("project_twitter") or "",
        "telegram": payload.get("telegram") or "",
        "seal_nft": payload.get("seal_nft") or "",
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    submissions.append(entry)
    save_json(SUBMISSIONS_FILE, submissions)

    return jsonify({"ok": True})


# ---------- API: Create Xaman Payload ----------

@app.route("/create_payload", methods=["POST"])
def create_payload():
    """
    Create a Xaman (XUMM) payment payload for RAD Ledger certification.
    """
    data = request.get_json(force=True)
    amount_xrp = data.get("amount", 5)
    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu",  # RAD Treasury
            "Amount": str(int(float(amount_xrp) * 1_000_000)),
        },
        "custom_meta": {
            "instruction": f"RAD Ledger certification payment: {project}",
            "identifier": project,
        },
        "options": {
            "return_url": {"web": "https://radgarlington.io/ledger.html"},
        },
    }

    try:
        resp = requests.post(
            "https://xumm.app/api/v1/platform/payload",
            headers=HEADERS,
            json=payload,
            timeout=10,
        )
        resp.raise_for_status()
        payload_resp = resp.json()
        return jsonify({
            "uuid": payload_resp.get("uuid"),
            "next": payload_resp.get("next"),
            "refs": payload_resp.get("refs"),
            "project": project,
            "issuer": issuer,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- API: Webhook from Xaman ----------

@app.route("/webhook", methods=["POST"])
def webhook():
    """
    Receive webhook callbacks from Xaman when a payment is signed & confirmed.
    Currently logs a simple Certified entry into ledger.json.
    """
    data = request.get_json(force=True)
    if not data or "payloadResponse" not in data:
        return "invalid", 400

    tx = data["payloadResponse"]

    if tx.get("signed") and tx.get("dispatched"):
        custom_meta = tx.get("custom_meta") or {}
        project = custom_meta.get("identifier", "Unknown Project")

        new_entry = {
            "project": project,
            "issuer": tx.get("response", {}).get("account", ""),
            "status": "Certified",
            "ledger_index": tx.get("txid", "pending"),
            "cert_number": "XRPL589",
        }

        ledger = load_ledger()
        ledger.append(new_entry)
        save_ledger(ledger)

        return "ok", 200

    return "ignored", 200


# ---------- Main ----------

if __name__ == "__main__":
    # For local debugging only; in production we use gunicorn via systemd.
    app.run(host="0.0.0.0", port=5000)
