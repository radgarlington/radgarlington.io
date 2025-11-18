import json
from collections import defaultdict

LEDGER_FILE = "/home/mrcauliman/rad_repo/ledger.json"
HARVEST_FILE = "/home/mrcauliman/xrpl_harvest/output/unverified.json"
OUTPUT_FILE = "/home/mrcauliman/rad_repo/ledger.json"

print("Loading existing ledger.json…")
with open(LEDGER_FILE, "r") as f:
    existing = json.load(f)

# Keep ONLY Certified/Verified entries
clean_base = [
    item for item in existing 
    if item.get("tier") in ["Certified", "Verified"]
]

print(f"Certified/Verified kept: {len(clean_base)}")

print("Loading harvested tokens (320)…")
with open(HARVEST_FILE, "r") as f:
    harvested = json.load(f)

# Convert harvested tokens into full unverified schema
def full_unverified(entry):
    return {
        "token": f"${entry['symbol']}",
        "issuer": entry.get("issuer", ""),
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

unverified_items = [full_unverified(e) for e in harvested]

print(f"Imported unverified tokens: {len(unverified_items)}")

# Group duplicates by ticker
groups = defaultdict(list)
for item in unverified_items:
    token = item.get("token", "").upper()
    groups[token].append(item)

final_unverified = []

for token, items in groups.items():

    # NO duplicates → keep single item
    if len(items) == 1:
        final_unverified.append(items[0])
        continue

    # MULTIPLE issuers → group the variants
    variants = []
    for e in items:
        variants.append({
            "issuer": e.get("issuer", ""),
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
        })

    final_unverified.append({
        "token": token,
        "grouped": True,
        "variant_count": len(variants),
        "variants": variants,
        "tier": "Unverified"
    })

print(f"Final unverified after grouping: {len(final_unverified)}")

# Combine results
final_ledger = clean_base + final_unverified

print(f"FINAL LEDGER SIZE: {len(final_ledger)}")

with open(OUTPUT_FILE, "w") as f:
    json.dump(final_ledger, f, indent=2)

print("Ledger rebuilt successfully.")
