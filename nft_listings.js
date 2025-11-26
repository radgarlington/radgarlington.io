/* =========================================================
   RAD NFT LISTINGS — Core JS (LOCKED v4)
   WCK Featured + WCK in grid + RAD-only placeholders
   ========================================================= */

console.log("RAD NFT LISTINGS — v4 (WCK + RAD placeholders)");

/* ============================
   NFT DATA
   ============================ */
const nftData = [

  /* ======== FEATURED + GRID NFT: WCK ======== */
  {
    id: "wck",
    token: "$WCK",
    name: "CONTINENTAL WICK",
    status: "certified",
    droppingSoon: true,
    image: "assets/logos/wck_logo.webp",
    desc: "Protocol Enforcement Collection — Dropping Soon.",
    showInGrid: true      // ✅ SHOW IN GRID (first card)
  },

  /* ======== PLACEHOLDER SLOTS (RAD ONLY) ======== */
  {
    id: "ph-1",
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",   // ✅ RAD ledger art
    desc: "",
    showInGrid: true                  // ✅ Visible in grid
  },

  {
    id: "ph-2",
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",   // ✅ RAD ledger art
    desc: "",
    showInGrid: true                  // ✅ Visible in grid
  }

];

/* =========================================================
   FEATURED NFT RENDERING (WCK ONLY)
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData[0]; // WCK always at index 0

  featuredWrap.innerHTML = `
    <div class="featured-card">
      <img src="${featured.image}" alt="${featured.name}">
      <h3>${featured.name}</h3>
      <p>${featured.desc}</p>
      ${featured.droppingSoon ? `<div style="
        background:#b41010;
        color:#fff;
        font-weight:800;
        padding:6px 10px;
        border-radius:8px;
        margin-top:8px;
        display:inline-block;
      ">DROPPING SOON</div>` : ""}
    </div>
  `;
}

/* =========================================================
   GRID RENDERING
   ========================================================= */
function renderGrid(filter = "all") {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = nftData.filter(item => {
    if (!item.showInGrid) return false;      // only grid-allowed
    if (filter === "all") return true;
    return item.status === filter;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let html = "";

    if (item.droppingSoon) {
      html += `
        <div style="
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
        ">
          DROPPING SOON
        </div>
      `;
    }

    // 🔒 Image only for placeholders – WCK gets its real logo
    const imgSrc = item.image || "assets/RAD_ledger.png";

    html += `
      <img src="${imgSrc}" alt="${item.id === 'wck' ? item.name : 'RAD Ledger Placeholder NFT'}">
    `;

    // Text only for WCK (placeholders stay nameless)
    if (item.name) {
      html += `<h3>${item.name}</h3>`;
    }
    if (item.desc) {
      html += `<p>${item.desc}</p>`;
    }

    card.innerHTML = html;
    grid.appendChild(card);
  });
}

/* =========================================================
   FILTER LOGIC
   ========================================================= */
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      renderGrid(filter);
    });
  });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();    // WCK hero
  renderGrid("all");   // WCK + 2 RAD placeholders
  initFilters();
});
