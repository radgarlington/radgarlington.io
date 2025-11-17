from flask import Flask, request, jsonify, render_template
import requests, json, os
from datetime import datetime, timezone
import smtplib
from email.message import EmailMessage

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

LEDGER_FILE = "/var/www/radgarlington.io/ledger.json"
SUBMISSIONS_FILE = "/var/www/radgarlington.io/submissions.json"

# Email notification config
EMAIL_TO = "radgarlington@gmail.com"  # where alerts are sent
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.environ.get("RAD_EMAIL_USER", "")
SMTP_PASS = os.environ.get("RAD_EMAIL_PASS", "")


# ---------- Utility Functions ----------

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE, "r") as f:
            return json.load(f)
    return []


def save_ledger(data):
    with open(LEDGER_FILE, "w") as f:
        json.dump(data, f, indent=2)


def load_submissions():
    if os.path.exists(SUBMISSIONS_FILE):
        try:
            with open(SUBMISSIONS_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception:
            pass
    return []


def save_submissions(entries):
    with open(SUBMISSIONS_FILE, "w") as f:
        json.dump(entries, f, indent=2)


def send_email_notification(entry: dict):
    """
    Fire an email to EMAIL_TO when a new submission is logged.
    If SMTP env vars are missing, this silently no-ops.
    """
    if not SMTP_USER or not SMTP_PASS:
        # Email not configured, skip
        return

    token_name = entry.get("token_name", "(no name)")
    token_symbol = entry.get("token_symbol", "")
    tier = entry.get("tier", "")
    dev = entry.get("developer", "")
    issuer = entry.get("issuer", "")
    submitted_at = entry.get("submitted_at", "")

    subject = f"RAD Ledger submission: {token_name} [{token_symbol}] ({tier})"

    lines = [
        f"New RAD Ledger submission received.",
        "",
        f"Tier:        {tier}",
        f"Token:       {token_name} ({token_symbol})",
        f"Issuer:      {issuer}",
        f"Developer:   {dev}",
        f"Dev X:       {entry.get('developer_x', '')}",
        f"Website:     {entry.get('website', '')}",
        f"Email:       {entry.get('email', '')}",
        f"Twitter:     {entry.get('project_twitter', '')}",
        f"Telegram:    {entry.get('telegram', '')}",
        "",
        f"Submitted at: {submitted_at}",
    ]

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_TO
    msg["To"] = EMAIL_TO
    msg.set_content("\n".join(lines))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
    except Exception as e:
        app.logger.error(f"Email send failed: {e}")


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
            "Destination": "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu",  # live treasury wallet
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


@app.route("/api/submit-token", methods=["POST"])
def submit_token():
    """
    Accept a new token submission from the Submit form and log to submissions.json
    """
    data = request.get_json(force=True) or {}

    tier = data.get("tier", "unknown")
    entry = {
        "tier": tier,
        "developer": data.get("developer", ""),
        "developer_x": data.get("developer_x", ""),
        "token_name": data.get("token_name", ""),
        "token_symbol": data.get("token_symbol", ""),
        "issuer": data.get("issuer", ""),
        "website": data.get("website", ""),
        "email": data.get("email", ""),
        "project_twitter": data.get("project_twitter", ""),
        "telegram": data.get("telegram", ""),
        "seal_nft": data.get("seal_nft", ""),
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }

    # Log to file
    log = load_submissions()
    log.append(entry)
    save_submissions(log)

    # Fire email (if configured)
    send_email_notification(entry)

    return jsonify({"ok": True})


@app.route("/api/submissions", methods=["GET"])
def api_submissions():
    """
    Raw JSON of all submissions (for tooling or future UI)
    """
    return jsonify(load_submissions())


@app.route("/admin/submissions")
def admin_submissions():
    """
    Simple admin view of submissions in the browser
    """
    subs = load_submissions()
    # newest first
    subs = list(reversed(subs))
    return render_template("admin_submissions.html", submissions=subs)


# ---------- Main ----------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
