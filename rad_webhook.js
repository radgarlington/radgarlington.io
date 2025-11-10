// ─────────────────────────────────────────────
// RAD Ledger Xumm Webhook — Full Live Script
// ─────────────────────────────────────────────

import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import fs from "fs";
import nodemailer from "nodemailer";

const app = express();
app.use(bodyParser.json());

/* CONFIG */
const PORT = 5890;
const XUMM_WEBHOOK_SECRET = "your_webhook_secret_here";
const TREASURY = "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu";

/* EMAIL SETTINGS (Gmail example — use app password) */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "radgarlington@gmail.com", // FROM address
    pass: "YOUR_APP_PASSWORD",       // Gmail App Password (not your login password)
  },
});

const SEND_TO = "radgarlington@gmail.com";

/* ───────────────────────────────────────────── */

app.post("/xumm/webhook", (req, res) => {
  try {
    // Verify signature
    const signature = req.headers["x-xumm-signature"];
    const computed = crypto
      .createHmac("sha1", XUMM_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== computed) {
      console.log("⚠️ Invalid signature from Xumm");
      return res.status(403).send("Invalid signature");
    }

    // Extract key data
    const payload = req.body.payload || {};
    const tx = payload.response?.txid || "UNKNOWN_TX";
    const destination = payload.tx_destination || "UNKNOWN_DEST";
    const memoData = payload.request_json?.Memos?.[0]?.Memo?.MemoData || "";
    const memo = Buffer.from(memoData, "base64").toString("utf8");
    const sender = payload.tx_account || "UNKNOWN_SENDER";
    const amountXRP = payload.response?.tx_json?.Amount
      ? (payload.response.tx_json.Amount / 1_000_000).toFixed(2)
      : "N/A";

    if (destination !== TREASURY) {
      console.log("❌ Destination mismatch:", destination);
      return res.sendStatus(200);
    }

    const record = {
      timestamp: new Date().toISOString(),
      txid: tx,
      sender,
      memo,
      amountXRP,
      status: "pending-certification",
    };

    // Log to JSON file
    const logFile = "./rad_ledger_log.json";
    const existing = fs.existsSync(logFile)
      ? JSON.parse(fs.readFileSync(logFile))
      : [];
    existing.push(record);
    fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
    console.log("✅ Logged:", record);

    // Send Email
    const subject = `🧾 RAD Ledger Payment Received — ${memo}`;
    const message = `
      <h2>New RAD Ledger Payment</h2>
      <p><strong>From:</strong> ${sender}</p>
      <p><strong>Amount:</strong> ${amountXRP} XRP</p>
      <p><strong>Memo:</strong> ${memo}</p>
      <p><strong>TxID:</strong> ${tx}</p>
      <p><strong>Status:</strong> Pending Certification</p>
      <hr>
      <p style="color:#666;font-size:.9rem">Auto-logged on ${new Date().toLocaleString()}</p>
    `;

    transporter.sendMail({
      from: `"The RAD Ledger" <radgarlington@gmail.com>`,
      to: SEND_TO,
      subject,
      html: message,
    });

    console.log("📧 Email notification sent to", SEND_TO);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

/* ───────────────────────────────────────────── */

app.listen(PORT, () =>
  console.log(`🚀 RAD Webhook listening on port ${PORT}`)
);
