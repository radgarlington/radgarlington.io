#!/usr/bin/env python3
import json
import os

LEDGER_PATH = "ledger.json"
HARVEST_PATH = os.path.expanduser("~/xrpl_harvest/output/unverified.json")

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def normalize_symbol(sym):
    if not sym:
        return ""
    return sym.upper().strip().replace("$","")

def merge_unverified(existing, harvested):
    """
    Merge harvested XRPL auto-tokens with existing unverified.
    Preserve issuer data, repair missing issuers, eliminate undefined.
    """

    by_symbol = {}

    # STEP 1 — index existing unverified
    for e in existing:
        sym = normalize_symbol(e.get("token"))
        if sym not in by_symbol:
            by_symbol[sym] = {
                "token": sym,
                "tier": "Unverified",
                "issuers": []
            }

        issuer = e.get("issuer")
        if issuer and issuer != "undefined":
            by_symbol[sym]["issuers"].append({
                "issuer": issuer,
                "domain": e.get("domain") or None
            })

    # STEP 2 — merge harvested tokens
    for h in harvested:
        sym = normalize_symbol(h.get("symbol") or h.get("token"))
        issuer = h.get("issuer")

        if sym not in by_symbol:
            by_symbol[sym] = {
                "token": sym,
                "tier": "Unverified",
                "issuers": []
            }

        if issuer and issuer != "undefined":
            exists = any(x["issuer"] == issuer for x in by_symbol[sym]["issuers"])
            if not exists:
                by_symbol[sym]["issuers"].append({
                    "issuer": issuer,
                    "domain": h.get("domain") or None
                })

    # STEP 3 — repair missing or empty issuers
    for sym, obj in by_symbol.items():
        if not obj["issuers"]:
            # Recover from original harvested set:
            for h in harvested:
                if normalize_symbol(h.get("symbol")) == sym:
                    issuer = h.get("issuer")
                    if issuer:
                        obj["issuers"].append({"issuer": issuer, "domain": h.get("domain")})
                        break

        # Still empty? Assign placeholder issuer
        if not obj["issuers"]:
            obj["issuers"].append({"issuer": "—", "domain": None})

        # Always set primary issuer for single-issuer tokens
        if len(obj["issuers"]) == 1:
            obj["issuer"] = obj["issuers"][0]["issuer"]
        else:
            obj["issuer"] = None

    return list(by_symbol.values())


def main():
    print("Loading ledger.json…")
    ledger = load_json(LEDGER_PATH)

    certified = [e for e in ledger if (e.get("tier") or "").lower() == "certified"]
    verified  = [e for e in ledger if (e.get("tier") or "").lower() == "verified"]
    expired   = [e for e in ledger if (e.get("tier") or "").lower() == "expired"]

    print(f"Certified preserved: {len(certified)}")
    print(f"Verified preserved: {len(verified)}")
    print(f"Expired preserved:  {len(expired)}")

    existing_unverified = [
        e for e in ledger
        if (e.get("tier") or "").lower() == "unverified"
    ]
    print(f"Existing unverified found: {len(existing_unverified)}")

    print("Loading harvested tokens…")
    harvested = load_json(HARVEST_PATH)
    print(f"Harvested tokens: {len(harvested)}")

    print("Merging & repairing unverified entries…")
    unverified = merge_unverified(existing_unverified, harvested)

    print(f"Final unverified count: {len(unverified)}")

    final = certified + verified + expired + unverified
    final = sorted(final, key=lambda x: (x["token"]))

    print(f"FINAL LEDGER SIZE: {len(final)}")
    print("Saving ledger.json…")

    with open(LEDGER_PATH, "w") as f:
        json.dump(final, f, indent=2)

    print("Ledger rebuilt successfully.")

if __name__ == "__main__":
    main()
