/* =========================================================
   RAD NFT COLLECTION REGISTRY — NEW COLLECTION ENGINE
   WCK Featured + Additional Collections from nft_ledger.json
   ========================================================= */

/* ============================
   FETCH COLLECTION DATA
   ============================ */

async function loadCollections() {
  try {
    const res = await fetch("nft_ledger.json", { cache: "no-store" });
    const data = await res.json();

    // Merge all categories into one flat list
    return [
      ...(data.certified || []),
      ...(data.verified || []),
      ...(data.unverified || [])
    ];
  } catch (err) {
    console.error("Error loading NFT Ledger:", err);
    return [];
  }
}

/* ============================
   RENDER FEATURED (TOP CARD)
   WCK will always be forced as the featured entry.
   ============================ */

async function renderFeatured() {
  const featuredWrap = document.getElementById("featuredNFT");
  if (!featuredWrap) return;

  const collections = await loadCollections();

  // Force WCK as featured
  const wck = collections.find(c =>
    c.collection_name &&
    c.collection_name.toLowerCase().includes("continental wick")
  );

  if (!wck) {
    featuredWrap.innerHTML = `<p>No featured collection available.</p>`;
    return;
  }

  featuredWrap.innerHTML = `
    <div class="collection-card">
      <div class="collection-bg" 
           style="background-image:url('${wck.banner || ""}');"></div>

      <img src="${wck.logo}" class="collection-logo">

      <div class="collection-content">
        <h3>${wck.collection_name}</h3>
        <div class="category">${wck.category || ""}</div>
        <p>${wck.description || ""}</p>

        <div class="collection-links">
          ${wck.collection_link ? `<a href="${wck.collection_link}" target="_blank">🔗 Collection</a>` : ""}
          ${wck.website ? `<a href="${wck.website}" target="_blank">🌐 Website</a>` : ""}
          ${wck.social_x ? `<a href="${wck.social_x}" target="_blank">𝕏 Social</a>` : ""}
        </div>
      </div>
    </div>
  `;
}

/* ============================
   RENDER GRID OF ALL COLLECTIONS
   (Below featured)
   ============================ */

async function renderGrid() {
  const grid = document.getElementById("nftGrid");
  if (!grid) return;

  const collections = await loadCollections();

  // Remove WCK so it does not repeat in the grid
  const filtered = collections.filter(c =>
    !(c.collection_name && c.collection_name.toLowerCase().includes("continental wick"))
  );

  grid.innerHTML = "";

  filtered.forEach(col => {
    const card = document.createElement("div");
    card.className = "collection-card";

    card.innerHTML = `
      <div class="collection-bg" 
           style="background-image:url('${col.banner || ""}');"></div>

      <img src="${col.logo}" class="collection-logo">

      <div class="collection-content">
        <h3>${col.collection_name || ""}</h3>
        <div class="category">${col.category || ""}</div>
        <p>${col.description || ""}</p>

        <div class="collection-links">
          ${col.collection_link ? `<a href="${col.collection_link}" target="_blank">🔗 Collection</a>` : ""}
          ${col.website ? `<a href="${col.website}" target="_blank">🌐 Website</a>` : ""}
          ${col.social_x ? `<a href="${col.social_x}" target="_blank">𝕏 Social</a>` : ""}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ============================
   INIT
   ============================ */

document.addEventListener("DOMContentLoaded", () => {
  renderFeatured();
  renderGrid();
});
