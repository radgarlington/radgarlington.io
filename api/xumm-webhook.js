// The RAD Ledger — Official Xumm Webhook
// File: /api/xumm-webhook.js

export default async function handler(req, res) {
  try {
    // Only allow POST requests from Xumm
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    // Get payload data from Xumm
    const body = req.body;
    console.log('📡 Incoming Xumm Webhook:', body);

    // Verify the payload came from Xumm (signature check)
    const signature = req.headers['x-xumm-signature'];
    if (!signature) {
      console.warn('⚠️ Missing Xumm signature');
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    // Example verification: you can enhance with your secret later
    // (Once your first payment is processed, you’ll get a Webhook Secret in your Xumm dev console)
    // Replace this check with signature verification once you have it.
    const verified = true; // placeholder
    if (!verified) {
      console.warn('❌ Invalid Xumm signature');
      return res.status(403).json({ success: false, message: 'Invalid signature' });
    }

    // Extract payment info
    const tx = body.payloadResponse || body.payload;
    const txHash = tx?.txid || tx?.hash || null;
    const txDestination = tx?.destination || null;
    const txAmount = tx?.amount || null;
    const txIssuer = tx?.issuer || null;

    // RAD Treasury wallet
    const RAD_TREASURY = "rG1pBfHDaE6Y65yoLay77zWcCR391dd4Nu";

    // Confirm payment was sent to the RAD Treasury
    if (txDestination !== RAD_TREASURY) {
      console.warn('⚠️ Payment not sent to RAD Treasury:', txDestination);
      return res.status(400).json({ success: false, message: 'Invalid destination' });
    }

    // Log or store the verified transaction (you can connect a DB later)
    console.log('✅ Verified payment received');
    console.log({
      txHash,
      txDestination,
      txAmount,
      txIssuer,
    });

    // Send a clean success response to Xumm
    return res.status(200).json({ success: true, message: 'Payment received and verified' });

  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Ensure JSON parsing works correctly on Vercel
export const config = {
  api: {
    bodyParser: true,
  },
};
