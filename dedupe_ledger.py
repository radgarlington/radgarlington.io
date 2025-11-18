import json

LEDGER_FILE = "/home/mrcauliman/rad_repo/ledger.json"
OUTPUT_FILE = "/home/mrcauliman/rad_repo/ledger.json"

print("Loading ledger.json…")
with open(LEDGER_FILE, "r") as f:
    data = json.load(f)

print(f"Initial count: {len(data)}")

seen = set()
clean = []

for item in data:
    token = item.get("token", "").upper()
    issuer = item.get("issuer", "")

    key = (token, issuer)

    if key in seen:
        continue

    seen.add(key)
    clean.append(item)

print(f"Cleaned count: {len(clean)} (removed {len(data) - len(clean)} duplicates)")

with open(OUTPUT_FILE, "w") as f:
    json.dump(clean, f, indent=2)

print("Deduplication complete.")
