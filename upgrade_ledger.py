import json
from datetime import datetime

LEDGER_FILE = "/home/mrcauliman/rad_repo/ledger.json"
HARVEST_FILE = "/home/mrcauliman/xrpl_harvest/output/unverified.json"
OUTPUT_FILE = "/home/mrcauliman/rad_repo/ledger.json"

# Standardized full metadata schema for unverified tokens
def full_unverified_block(token, issuer=""):
    return {
        "token": f"${token}",
        "issuer": issuer,
        "website": "",
        "dev": "",
        "devx": "",
        "email": "",
        "x": "",
        "tg": "",
        "nft": "",
        "logo_url": "",
        "registered_at": None,
        "expires_at": None,
        "doxxed": False,
        "tier": "Unverified"
    }

# ---------------------------------------------------------

print("Loading ledger.json…")
with open(LEDGER_FILE, "r") as f:
    ledger = json.load(f)

print("Upgrading existing unverified entries…")
updated_ledger = []

for item in ledger:
    if item.get("tier") == "Unverified":
        token = item.get("token", "").replace("$", "")
        updated_ledger.append(full_unverified_block(token))
    else:
        updated_ledger.append(item)

# ---------------------------------------------------------

print("Loading harvested tokens…")
with open(HARVEST_FILE, "r") as f:
    harvested = json.load(f)

print("Converting harvested tokens to full schema…")
for entry in harvested:
    symbol = entry["symbol"]
    issuer = entry.get("issuer", "")
    updated_ledger.append(full_unverified_block(symbol, issuer))

# ---------------------------------------------------------

print(f"Total final ledger entries: {len(updated_ledger)}")

print("Saving upgraded ledger.json…")
with open(OUTPUT_FILE, "w") as f:
    json.dump(updated_ledger, f, indent=2)

print("Ledger upgrade complete.")
