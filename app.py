@app.route("/create_payload", methods=["POST"])
def create_payload():
    data = request.get_json(force=True)
    amount_xrp = float(data.get("amount", 5))
    project = data.get("project", "Unknown Project")
    issuer = data.get("issuer", "Unknown Issuer")

    # Ensure integer drops (1 XRP = 1,000,000 drops)
    drops = str(int(amount_xrp * 1_000_000))

    payload = {
        "txjson": {
            "TransactionType": "Payment",
            "Destination": "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu",  # your treasury wallet
            "Amount": drops
        },
        "custom_meta": {
            "instruction": f"RAD Ledger certification payment: {project}",
            "identifier": project
        },
        "options": {
            "submit": True,  # forces broadcast to XRPL
            "return_url": {"web": "https://radgarlington.io/ledger.html"}
        }
    }

    try:
        resp = requests.post(
            "https://xumm.app/api/v1/platform/payload",
            headers=HEADERS,
            json=payload
        )
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
