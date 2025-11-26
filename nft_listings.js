/* =========================================================
   RAD NFT LISTINGS — Core JS
   Clean, synced with CSS, WCK Featured NFT enabled
   ========================================================= */

/* ============================
   NFT DATA
   ============================ */
const nftData = [

  /* ======== FEATURED NFT: WCK (Featured Only) ======== */
  {
    token: "$WCK",
    name: "CONTINENTAL WICK",
    status: "certified",
    droppingSoon: true,
    image: "assets/logos/wck_logo.webp",
    desc: "Protocol Enforcement Collection — Dropping Soon.",
    showInGrid: false   // ✅ FEATURED ONLY, NOT IN GRID
  },

  /* ======== PLACEHOLDER SLOTS (HIDDEN FOR NOW) ======== */
  {
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: false   // ✅ NOT RENDERED IN GRID
  },

  {
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: "",
    showInGrid: false   // ✅ NOT RENDERED IN GRID
  }

];


/* =========================================================
   FEATURED NFT RENDERING
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
    if (!item.showInGrid) return false;         // ✅ Only items explicitly allowed
    if (filter === "all") return true;
    return item.status === filter;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

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

      <img src="${item.image}" alt="">
      <h3>${item.name || ""}</h3>
      <p>${item.desc || ""}</p>
    `;

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
  renderGrid("all");   // Bottom grid (currently empty)
  initFilters();
});
