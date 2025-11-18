import json
from collections import defaultdict

LEDGER_FILE = "/home/mrcauliman/rad_repo/ledger.json"
OUTPUT_FILE = "/home/mrcauliman/rad_repo/ledger.json"

print("Loading ledger.json…")
with open(LEDGER_FILE, "r") as f:
    data = json.load(f)

print(f"Initial entries: {len(data)}")

groups = defaultdict(list)

# Group by ticker (token)
for entry in data:
    token = entry.get("token", "").upper()
    groups[token].append(entry)

clean = []

for token, entries in groups.items():

    # If only one entry → keep normal
    if len(entries) == 1:
        clean.append(entries[0])
        continue

    # Multi-issuer → build group container
    variants = []

    for e in entries:
        variants.append({
            "issuer": e.get("issuer", ""),
            "website": e.get("website", ""),
            "dev": e.get("dev", ""),
            "devx": e.get("devx", ""),
            "email": e.get("email", ""),
            "x": e.get("x", ""),
            "tg": e.get("tg", ""),
            "nft": e.get("nft", ""),
            "logo_url": e.get("logo_url", ""),
            "registered_at": e.get("registered_at"),
            "expires_at": e.get("expires_at"),
            "doxxed": e.get("doxxed", False),
            "tier": e.get("tier", "Unverified")
        })

    group_entry = {
        "token": token,
        "grouped": True,
        "variant_count": len(variants),
        "variants": variants,
        "tier": "Unverified"
    }

    clean.append(group_entry)

print(f"Final grouped entries: {len(clean)}")

with open(OUTPUT_FILE, "w") as f:
    json.dump(clean, f, indent=2)

print("Grouping complete.")
