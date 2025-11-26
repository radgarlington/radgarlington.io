/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured + RAD_ledger placeholders + link buttons
   ========================================================= */

/* ============================
   NFT DATA
   ============================ */
const nftData = [

  /* ======== FEATURED NFT: WCK (also shows in grid) ======== */
  {
    token: "$WCK",
    name: "CONTINENTAL WICK",
    status: "certified",
    droppingSoon: true, // badge on cards
    image: "assets/logos/wck_logo.webp",
    desc: "Protocol Enforcement Collection.",
    showInGrid: true,

    // Optional meta
    issuer: "",       // XRPL issuer for the NFT collection (fill when ready)
    artist: "",       // Artist / studio name

    // Optional links (only render if non-empty)
    links: {
      xrpscan:   "",  // e.g. "https://xrpscan.com/nft/..."
      bithomp:   "",  // e.g. "https://bithomp.com/nft/..."
      collection:"",  // e.g. marketplace or gallery URL
      website:   ""   // project site
    }
  },

  /* ======== PLACEHOLDER 2 — RAD_ledger image ======== */
  {
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: true,

    issuer: "",
    artist: "",
    links: {
      xrpscan:   "",
      bithomp:   "",
      collection:"",
      website:   ""
    }
  },

  /* ======== PLACEHOLDER 3 — RAD_ledger image ======== */
  {
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: true,

    issuer: "",
    artist: "",
    links: {
      xrpscan:   "",
      bithomp:   "",
      collection:"",
      website:   ""
    }
  }

];


/* =========================================================
   FEATURED NFT RENDERING
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData[0]; // WCK index 0

  // Build meta + links blocks (same pattern as grid)
  const metaHTML =
    (featured.issuer || featured.artist)
      ? `
        <div class="card-meta">
          ${featured.issuer ? `<div><strong>Issuer:</strong> ${featured.issuer}</div>` : ""}
          ${featured.artist ? `<div><strong>Artist:</strong> ${featured.artist}</div>` : ""}
        </div>
      `
      : "";

  const links = featured.links || {};
  const linksHTML =
    (links.xrpscan || links.bithomp || links.collection || links.website)
      ? `
        <div class="card-links">
          ${links.xrpscan ? `<a href="${links.xrpscan}" target="_blank" rel="noopener">XRPSCAN</a>` : ""}
          ${links.bithomp ? `<a href="${links.bithomp}" target="_blank" rel="noopener">Bithomp</a>` : ""}
          ${links.collection ? `<a href="${links.collection}" target="_blank" rel="noopener">Collection</a>` : ""}
          ${links.website ? `<a href="${links.website}" target="_blank" rel="noopener">Website</a>` : ""}
        </div>
      `
      : "";

  featuredWrap.innerHTML = `
    <div class="featured-card" style="position:relative;">
      ${featured.droppingSoon ? `
        <div style="
          position:absolute;
          top:12px;
          right:12px;
          padding:4px 8px;
          font-size:.75rem;
          font-weight:800;
          border-radius:6px;
          background:#b41010;
          color:#fff;
          box-shadow:0 2px 6px rgba(0,0,0,.25);
        ">
          DROPPING SOON
        </div>
      ` : ""}

      <img src="${featured.image}" alt="${featured.name}">
      <h3>${featured.name}</h3>
      <p>${featured.desc}</p>
      ${metaHTML}
      ${linksHTML}
    </div>
  `;
}


/* =========================================================
   GRID RENDERING
   ========================================================= */
function renderGrid() {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = nftData.filter(item => item.showInGrid);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.position = "relative";

    const metaHTML =
      (item.issuer || item.artist)
        ? `
          <div class="card-meta">
            ${item.issuer ? `<div><strong>Issuer:</strong> ${item.issuer}</div>` : ""}
            ${item.artist ? `<div><strong>Artist:</strong> ${item.artist}</div>` : ""}
          </div>
        `
        : "";

    const links = item.links || {};
    const linksHTML =
      (links.xrpscan || links.bithomp || links.collection || links.website)
        ? `
          <div class="card-links">
            ${links.xrpscan ? `<a href="${links.xrpscan}" target="_blank" rel="noopener">XRPSCAN</a>` : ""}
            ${links.bithomp ? `<a href="${links.bithomp}" target="_blank" rel="noopener">Bithomp</a>` : ""}
            ${links.collection ? `<a href="${links.collection}" target="_blank" rel="noopener">Collection</a>` : ""}
            ${links.website ? `<a href="${links.website}" target="_blank" rel="noopener">Website</a>` : ""}
          </div>
        `
        : "";

    card.innerHTML = `
      ${item.droppingSoon ? `
        <div style="
          position:absolute;
          top:12px;
          right:12px;
          padding:4px 8px;
          font-size:.75rem;
          font-weight:800;
          border-radius:6px;
          background:#b41010;
          color:#fff;
          box-shadow:0 2px 6px rgba(0,0,0,.25);
        ">
          DROPPING SOON
        </div>
      ` : ""}

      <img src="${item.image}" alt="">
      <h3>${item.name || ""}</h3>
      <p>${item.desc || ""}</p>
      ${metaHTML}
      ${linksHTML}
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
