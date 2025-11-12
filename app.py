from flask import Flask, request, jsonify
import requests, json, os

app = Flask(__name__)

# ====================================================
#  RAD Ledger Backend — Payment + Webhook Handler
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
    """
    Create a Xaman (XUMM) payment payload for RAD Ledger certification
    """
    data = request.get_json(force=True)
    amount_xrp = float(data.get("amount", 5))
    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu",  # your live RAD treasury wallet
            "Amount": str(int(amount_xrp * 1_000_000))
        },
        "custom_meta": {
            "identifier": project,
            "instruction": f"RAD Ledger verification payment for {project} ({issuer})"
        },
        "options": {
            "submit": False,
            "return_url": {
                "app": "https://radgarlington.io/ledger.html",
                "web": "https://radgarlington.io/ledger.html"
            }
        }
    }

    try:
        r = requests.post(
            "https://xumm.app/api/v1/platform/payload",
            headers=HEADERS,
            json=payload,
            timeout=10
        )
        r.raise_for_status()
        return jsonify(r.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e), "payload": payload}), 500


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
            "project": project,
            "issuer": tx["response"]["account"],
            "status": "Certified",
            "ledger_index": tx.get("txid", "pending"),
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
