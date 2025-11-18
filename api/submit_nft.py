from flask import Blueprint, request
from uuid import uuid4
import json
from datetime import datetime

submit_nft = Blueprint("submit_nft", __name__)

@submit_nft.post("/api/submit-nft")
def submit_nft_route():
    data = request.json

    required = ["collection_name", "artist_name", "issuer", "collection_link", "logo"]
    for r in required:
        if r not in data:
            return {"error":f"Missing field: {r}"}, 400

    entry = {
        "id": f"radnft-{uuid4().hex[:6]}",
        "collection_name": data["collection_name"],
        "artist_name": data["artist_name"],
        "issuer": data["issuer"],
        "category": data.get("category","Uncategorized"),
        "description": data.get("description",""),
        "logo": data["logo"],
        "collection_link": data["collection_link"],
        "website": data.get("website",""),
        "social_x": data.get("social_x",""),
        "submitted_at": datetime.utcnow().isoformat(),
        "tx_hash": data.get("tx_hash","")
    }

    with open("nft_ledger.json","r") as f:
        ledger = json.load(f)

    ledger["unverified"].append(entry)

    with open("nft_ledger.json","w") as f:
        json.dump(ledger,f,indent=2)

    return {"success":True,"entry_id":entry["id"]}
