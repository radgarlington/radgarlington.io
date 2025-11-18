from flask import Blueprint
import requests

create_nft_payment = Blueprint("create_nft_payment", __name__)

XUMM_API = "https://xumm.app/api/v1/platform/payload"
API_KEY = "YOUR_XUMM_KEY"
API_SECRET = "YOUR_XUMM_SECRET"
RAD_TREASURY = "YOUR_TREASURY_WALLET"

@create_nft_payment.post("/api/create-nft-payment")
def create_payment():
    payload = {
      "txjson": {
        "TransactionType": "Payment",
        "Amount": "5000000",
        "Destination": RAD_TREASURY
      },
      "options": {
        "return_url": {
          "web": "https://radgarlington.io/nft_submitted"
        }
      }
    }

    r = requests.post(
        XUMM_API,
        json=payload,
        headers={"X-API-Key": API_KEY, "X-API-Secret": API_SECRET}
    )

    res = r.json()
    return {"uuid":res["uuid"],"next":res["next"]["always"]}
