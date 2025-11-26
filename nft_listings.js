/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured NFT only — grid intentionally empty for now
   ========================================================= */

/* ============================
   NFT DATA
   ============================ */
const nftData = [
  // Featured NFT: CONTINENTAL WICK (hero only)
  {
    token: "$WCK",
    name: "CONTINENTAL WICK",
    status: "certified",
    droppingSoon: true,
    image: "assets/logos/wck_logo.webp",
    desc: "Protocol Enforcement Collection — Dropping Soon."
  },

  // Placeholder slots kept for future use (not rendered)
  {
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: ""
  },
  {
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",
    desc: ""
  }
];

/* =========================================================
   FEATURED NFT RENDERING (WCK ONLY)
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData[0]; // WCK hero

  featuredWrap.innerHTML = `
    <div class="featured-card">
      <img src="${featured.image}" alt="${featured.name}">
      <h3>${featured.name}</h3>
      <p>${featured.desc}</p>
      ${
        featured.droppingSoon
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
   GRID RENDERING (INTENTIONALLY EMPTY FOR NOW)
   ========================================================= */
function renderGrid(filter = "all") {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  // Hard-clear: no cards rendered until we start listing collections.
  grid.innerHTML = "";
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

      // Still call renderGrid so the UI feels wired,
      // but it will keep the grid empty.
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
  renderGrid("all");   // bottom grid = empty
  initFilters();
});
