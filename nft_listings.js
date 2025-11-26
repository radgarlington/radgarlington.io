/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured, neutral RAD placeholders in grid
   ========================================================= */

/* ============================
   NFT DATA
   ============================ */
const nftData = [
  // ======== FEATURED NFT: WCK (hero only) ========
  {
    id: "wck",
    featured: true,
    status: "certified",
    droppingSoon: true,
    image: "assets/logos/wck_logo.webp",
    title: "CONTINENTAL WICK",
    text: "Protocol Enforcement Collection — Dropping Soon."
  },

  // ======== PLACEHOLDER SLOTS (no tokens / names, RAD_ledger.png only) ========
  {
    id: "slot1",
    featured: false,
    status: "certified",
    showInGrid: true,
    image: "assets/RAD_ledger.png"
  },
  {
    id: "slot2",
    featured: false,
    status: "verified",
    showInGrid: true,
    image: "assets/RAD_ledger.png"
  },
  {
    id: "slot3",
    featured: false,
    status: "unverified",
    showInGrid: true,
    image: "assets/RAD_ledger.png"
  }
];

/* =========================================================
   FEATURED NFT RENDERING (WCK only)
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData.find(item => item.featured);
  if (!featured) return;

  featuredWrap.innerHTML = `
    <div class="featured-card">
      <img src="${featured.image}" alt="${featured.title}">
      <h3>${featured.title}</h3>
      <p>${featured.text}</p>
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
   GRID RENDERING (RAD placeholders only, no names/tokens)
   ========================================================= */
function renderGrid(filter = "all") {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = nftData.filter(item => {
    // never show the featured (WCK) in the grid
    if (item.featured) return false;
    if (!item.showInGrid) return false;

    if (filter === "all") return true;
    return item.status === filter;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    // Pure visual placeholder: RAD_ledger.png only, no token text / names
    card.innerHTML = `
      <img src="assets/RAD_ledger.png" alt="RAD NFT placeholder">
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
  renderGrid("all");   // RAD placeholders only
  initFilters();
});
