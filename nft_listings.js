/* =========================================================
   RAD NFT LISTINGS — Core JS
   WCK Featured + RAD_ledger placeholders
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
    showInGrid: true
  },

  /* ======== PLACEHOLDER 2 — RAD_ledger image ======== */
  {
    token: "",
    name: "",
    status: "certified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",   // ✅ placeholder image
    desc: "",
    showInGrid: true
  },

  /* ======== PLACEHOLDER 3 — RAD_ledger image ======== */
  {
    token: "",
    name: "",
    status: "verified",
    droppingSoon: false,
    image: "assets/RAD_ledger.png",   // ✅ placeholder image
    desc: "",
    showInGrid: true
  }

];


/* =========================================================
   FEATURED NFT RENDERING
   ========================================================= */
function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const featured = nftData[0]; // WCK index 0

  featuredWrap.innerHTML = `
    <div class="featured-card">
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
