from flask import Flask, request, jsonify
import requests, json, os, base64

app = Flask(__name__)

# ====================================================
#  RAD Ledger Backend — Xaman Payment + Webhook Handler
# ====================================================

# Xaman (XUMM) API credentials
API_KEY = "2a4001ce-0a75-42bc-8bd2-8ef096ac26d4"
API_SECRET = "7c508def-83b7-41c9-b4a1-2c82da1d6a79"
HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "x-api-secret": API_SECRET
}

LEDGER_FILE = "/var/www/radgarlington.io/ledger.json"
TREASURY_WALLET = "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu"  # Live treasury wallet

# ---------- Utility ----------
def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, "r") as f:
            return json.load(f)
    return []

def save_ledger(data):
    with open(LEDGER_FILE, "w") as f:
        json.dump(data, f, indent=2)

# ---------- Routes ----------

@app.route("/create_payload", methods=["POST"])
def create_payload():
    """Create a Xaman payment payload for RAD Ledger certification"""
    data = request.get_json(force=True)
    try:
        amount_xrp = float(data.get("amount", 5))
    except:
        amount_xrp = 5.0

    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    memo_text = f"RAD LEDGER | {project} | {issuer}"
    memo_encoded = base64.b64encode(memo_text.encode()).decode()

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": TREASURY_WALLET,
            "Amount": str(int(amount_xrp * 1_000_000)),
            "Memos": [{"Memo": {"MemoData": memo_encoded}}]
        },
        "custom_meta": {
            "instruction": f"RAD Ledger Certification: {project}",
            "identifier": project
        },
        "options": {
            "return_url": {"web": "https://radgarlington.io/ledger"}
        }
    }

    try:
        resp = requests.post(
            "https://xumm.app/api/v1/platform/payload",
            headers=HEADERS,
            json=payload,
            timeout=10
        )
        resp.raise_for_status()
        payload_resp = resp.json()
        return jsonify({
            "uuid": payload_resp.get("uuid"),
            "next": payload_resp.get("next"),
            "refs": payload_resp.get("refs"),
            "project": project,
            "issuer": issuer
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/webhook", methods=["POST"])
def webhook():
    """Handle webhook callbacks from Xaman when payments are signed"""
    data = request.get_json(force=True)
    if not data or "payloadResponse" not in data:
        return "invalid", 400

    tx = data["payloadResponse"]
    if tx.get("signed") and tx.get("dispatched"):
        project = tx.get("custom_meta", {}).get("identifier", "Unknown")
        new_entry = {
            "project": project,
            "issuer": tx.get("response", {}).get("account", "Unknown"),
            "status": "Certified",
            "ledger_index": tx.get("response", {}).get("txid", "pending"),
            "cert_number": "XRPL589"
        }
        ledger = load_ledger()
        ledger.append(new_entry)
        save_ledger(ledger)
        return "ok", 200

    return "ignored", 200


# ---------- Main ----------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
