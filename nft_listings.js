/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured + 2 RAD placeholder slots
   ========================================================= */

/* ============================
   NFT DATA
   ============================ */
const nftData = [

  /* ======== FEATURED + GRID NFT: WCK ======== */
  {
    token: "$WCK",
    name: "CONTINENTAL WICK",
    status: "certified",
    droppingSoon: true,
    image: "assets/logos/wck_logo.webp",
    desc: "Protocol Enforcement Collection — Dropping Soon.",
    showInGrid: true,   // ✅ show as first card in grid

    // 🔹 Fill these when you’re ready
    collection: "",     // e.g. "CONTINENTAL WICK — Series 1"
    issuer: "",         // e.g. "rXXXXXXXX..."
    xrpscan: "",        // e.g. "https://xrpscan.com/nft/..."
    bithomp: "",        // e.g. "https://bithomp.com/nft/..."
    link: ""            // e.g. "https://wicktoken.net/nft"
  },

  /* ======== PLACEHOLDER 1 ======== */
  {
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: true,
    collection: "",
    issuer: "",
    xrpscan: "",
    bithomp: "",
    link: ""
  },

  /* ======== PLACEHOLDER 2 ======== */
  {
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: true,
    collection: "",
    issuer: "",
    xrpscan: "",
    bithomp: "",
    link: ""
  }

];


/* =========================================================
   FEATURED NFT RENDERING (top card)
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData[0]; // WCK always at index 0

  // Meta line (only if data exists)
  const metaPieces = [];
  if (featured.collection) metaPieces.push(`<strong>Collection:</strong> ${featured.collection}`);
  if (featured.issuer)     metaPieces.push(`<strong>Issuer:</strong> ${featured.issuer}`);

  const metaHtml = metaPieces.length
    ? `<div class="card-meta">${metaPieces.join(" &nbsp;•&nbsp; ")}</div>`
    : "";

  // Link buttons (only if URLs exist)
  const linkButtons = [];
  if (featured.xrpscan) {
    linkButtons.push(
      `<a href="${featured.xrpscan}" target="_blank" rel="noopener">XRPSCAN</a>`
    );
  }
  if (featured.bithomp) {
    linkButtons.push(
      `<a href="${featured.bithomp}" target="_blank" rel="noopener">Bithomp</a>`
    );
  }
  if (featured.link) {
    linkButtons.push(
      `<a href="${featured.link}" target="_blank" rel="noopener">View Collection</a>`
    );
  }

  const linksHtml = linkButtons.length
    ? `<div class="card-links">${linkButtons.join("")}</div>`
    : "";

  featuredWrap.innerHTML = `
    <img src="${featured.image}" alt="${featured.name}">
    <h3>${featured.name}</h3>
    <p>${featured.desc}</p>
    ${metaHtml}
    ${linksHtml}
    ${featured.droppingSoon ? `<div style="
      background:#b41010;
      color:#fff;
      font-weight:800;
      padding:6px 10px;
      border-radius:8px;
      margin-top:10px;
      display:inline-block;
    ">DROPPING SOON</div>` : ""}
  `;
}


/* =========================================================
   GRID RENDERING (bottom row)
   ========================================================= */
function renderGrid() {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = nftData.filter(item => item.showInGrid);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    // Meta for grid
    const metaPieces = [];
    if (item.collection) metaPieces.push(`<strong>Collection:</strong> ${item.collection}`);
    if (item.issuer)     metaPieces.push(`<strong>Issuer:</strong> ${item.issuer}`);
    const metaHtml = metaPieces.length
      ? `<div class="card-meta">${metaPieces.join(" &nbsp;•&nbsp; ")}</div>`
      : "";

    // Link buttons for grid
    const linkButtons = [];
    if (item.xrpscan) {
      linkButtons.push(
        `<a href="${item.xrpscan}" target="_blank" rel="noopener">XRPSCAN</a>`
      );
    }
    if (item.bithomp) {
      linkButtons.push(
        `<a href="${item.bithomp}" target="_blank" rel="noopener">Bithomp</a>`
      );
    }
    if (item.link) {
      linkButtons.push(
        `<a href="${item.link}" target="_blank" rel="noopener">View Collection</a>`
      );
    }

    const linksHtml = linkButtons.length
      ? `<div class="card-links">${linkButtons.join("")}</div>`
      : "";

    card.innerHTML = `
      ${item.droppingSoon ? `<div style="
        background:#b41010;
        color:#fff;
        font-weight:800;
        padding:4px 8px;
        border-radius:6px;
        position:absolute;
        top:12px;
        right:12px;
        font-size:.75rem;
        box-shadow:0 2px 6px rgba(0,0,0,.25);
      ">DROPPING SOON</div>` : ""}

      <img src="${item.image}" alt="${item.name || ''}">
      <h3>${item.name || ""}</h3>
      <p>${item.desc || ""}</p>
      ${metaHtml}
      ${linksHtml}
    `;

    grid.appendChild(card);
  });
}


/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  renderGrid();
});
