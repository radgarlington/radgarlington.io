from flask import Flask, request, jsonify, render_template
import requests, json, os

app = Flask(__name__)

# Xaman API keys
API_KEY = "YOUR_XUMM_API_KEY"
API_SECRET = "YOUR_XUMM_API_SECRET"
HEADERS = {"Content-Type": "application/json", "x-api-key": API_KEY, "x-api-secret": API_SECRET}

LEDGER_FILE = "ledger.json"

# Utility: read/write ledger file
def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, "r") as f:
            return json.load(f)
    return []

def save_ledger(data):
    with open(LEDGER_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/create_payload", methods=["POST"])
def create_payload():
    data = request.get_json()
    amount_xrp = data.get("amount", 5)
    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": "rYourTreasuryWalletAddress",
            "Amount": str(int(amount_xrp * 1_000_000))
        },
        "custom_meta": {
            "instruction": f"Payment for RAD Ledger certification: {project}",
            "identifier": project
        },
        "options": {"return_url": {"web": "https://radgarlington.io"}}
    }

    resp = requests.post("https://xumm.app/api/v1/platform/payload", headers=HEADERS, json=payload)
    payload_resp = resp.json()
    return jsonify({
        "uuid": payload_resp.get("uuid"),
        "next": payload_resp.get("next"),
        "refs": payload_resp.get("refs"),
        "project": project,
        "issuer": issuer
    })

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
