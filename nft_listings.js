/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured NFT + anonymous RAD placeholders in grid
   ========================================================= */

/* ============================
   FEATURED NFT (HERO)
   ============================ */
const featuredNFT = {
  name: "CONTINENTAL WICK",
  status: "certified",
  droppingSoon: true,
  image: "assets/logos/wck_logo.webp",
  desc: "Protocol Enforcement Collection — Dropping Soon."
};

/* ============================
   GRID PLACEHOLDERS
   (NO TOKEN NAMES, NO PROJECT NAMES)
   ============================ */
const gridSlots = [
  {
    status: "certified",
    image: "assets/RAD_ledger.png"
  },
  {
    status: "verified",
    image: "assets/RAD_ledger.png"
  },
  {
    status: "unverified",
    image: "assets/RAD_ledger.png"
  }
];

/* =========================================================
   FEATURED NFT RENDERING (WCK HERO)
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const f = featuredNFT;

  featuredWrap.innerHTML = `
    <div class="featured-card">
      <img src="${f.image}" alt="${f.name}">
      <h3>${f.name}</h3>
      <p>${f.desc}</p>
      ${
        f.droppingSoon
          ? `<div style="
                background:#b41010;
                color:#fff;
                font-weight:800;
                padding:6px 10px;
                border-radius:8px;
                margin-top:8px;
                display:inline-block;
             ">DROPPING SOON</div>`
          : ""
      }
    </div>
  `;
}

/* =========================================================
   GRID RENDERING (RAD LEDGER PLACEHOLDERS ONLY)
   ========================================================= */
function renderGrid(filter = "all") {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = gridSlots.filter(slot => {
    if (filter === "all") return true;
    return slot.status === filter;
  });

  filtered.forEach(slot => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${slot.image}" alt="RAD Ledger NFT placeholder">
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
  renderFeatured();    // WCK hero only
  renderGrid("all");   // grid with RAD_ledger placeholders only
  initFilters();
});
