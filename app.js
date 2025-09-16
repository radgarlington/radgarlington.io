const API = "https://api.radgarlington.io";

const el = (id) => document.getElementById(id);
const tokensInput = el("tokens");
const buyBtn = el("buyBtn");
const busy = el("busy");
const priceBox = el("priceBox");
const estBox = el("estBox");
const result = el("result");
const health = el("health");

const fmt = (n, d=6) => Number(n).toFixed(d);
const fmtDrops = (d) => `${d.toLocaleString()} drops`;
const USD_PER_1M_RAD = 1.0; // $1 per 1,000,000 RAD
const USD_PER_TOKEN = USD_PER_1M_RAD / 1_000_000;

async function api(path, opts = {}) {
  const r = await fetch(`${API}${path}`, opts);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function refreshHealth() {
  try {
    const h = await api("/healthz");
    health.textContent = h.ok ? "API: healthy" : "API: issue";
  } catch {
    health.textContent = "API: unreachable";
  }
}

let lastPrice = null;

async function refreshPrice() {
  try {
    const p = await api("/api/price/source"); // includes cache TTL/age
    lastPrice = p.xrp_usd; // USD per 1 XRP
    priceBox.textContent = `USD/XRP: ${fmt(lastPrice, 8)} (cache TTL ${p.cache_ttl_secs}s)`;
    updateEstimate();
  } catch {
    priceBox.textContent = "USD/XRP: unavailable";
  }
}

function updateEstimate() {
  const tokens = Math.max(1, parseInt(tokensInput.value || "0", 10));
  const usd = tokens * USD_PER_TOKEN;
  if (lastPrice && lastPrice > 0) {
    const xrp = usd / lastPrice;
    const drops = Math.ceil(xrp * 1_000_000);
    estBox.textContent = `Estimate: ${fmt(usd, 2)} USD ≈ ${fmt(xrp, 6)} XRP = ${drops.toLocaleString()} drops`;
  } else {
    estBox.textContent = `Estimate: ${fmt(usd, 2)} USD`;
  }
}

tokensInput.addEventListener("input", updateEstimate);

async function createPaylink() {
  const tokens = Math.max(1, parseInt(tokensInput.value || "0", 10));
  busy.hidden = false;
  buyBtn.disabled = true;
  result.innerHTML = `<p class="muted">Requesting paylink…</p>`;

  try {
    const body = JSON.stringify({
      tokens,
      // You can uncomment if you want to force return pages, but your API has defaults:
      // return_web: "https://radgarlington.io/thanks.html",
      // return_app: "radgarlington://thanks"
    });

    const r = await api("/api/paylink", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body,
    });

    if (!r.ok) throw new Error(r.error || "Paylink failed");
    const { deeplink, qr, uuid, xrp_usd, drops, xrp } = r;

    const qrImg = qr ? `<img src="${qr}" alt="XUMM QR" class="qr" />` : "";
    const deepLinkBtn = deeplink ? `<a class="btn" href="${deeplink}">Open in Xaman</a>` : "";

    result.innerHTML = `
      <div class="mono">UUID: ${uuid || "(n/a)"}</div>
      <div class="mono">Price (USD/XRP): ${fmt(xrp_usd ?? lastPrice ?? 0, 8)}</div>
      <div class="mono">Amount: ${fmt(xrp ?? drops/1_000_000, 6)} XRP (${fmtDrops(drops)})</div>
      <div class="actions">
        ${deepLinkBtn}
      </div>
      ${qrImg}
      <p class="muted">Scan QR in Xaman (or tap “Open in Xaman” on mobile).</p>
    `;
  } catch (e) {
    result.innerHTML = `<p class="error">Error: ${e.message}</p>`;
  } finally {
    busy.hidden = true;
    buyBtn.disabled = false;
  }
}

buyBtn.addEventListener("click", createPaylink);

refreshHealth();
refreshPrice();
updateEstimate();
setInterval(refreshPrice, 25_000);
