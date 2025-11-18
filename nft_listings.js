/* Load NFT Ledger */
fetch('nft_ledger.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(data => {
    window.nftData = data;
    renderFeatured();
    renderCards('all');
  });

/* LOGO PATH RESOLVER — NO FAILURE ALLOWED */
function nftLogo(rawPath) {

  // If missing or null → force RAD fallback
  if (!rawPath) return "/assets/RAD_ledger.png";

  // If file exists inside /assets/logos/ → use it
  if (rawPath.startsWith("/assets/")) return rawPath;

  // If someone puts a filename only: logo.png → force assets path
  if (!rawPath.startsWith("/")) return `/assets/${rawPath}`;

  // Final fallback
  return "/assets/RAD_ledger.png";
}

/* FEATURED NFT */
function renderFeatured() {
  const wrap = document.getElementById("featuredNFT");

  let f =
    nftData.certified[0] ||
    nftData.verified[0] ||
    nftData.unverified[0];

  if (!f) {
    wrap.innerHTML = `
      <img src="/assets/RAD_ledger.png">
      <h3>Coming Soon</h3>
      <p>No featured NFT selected.</p>
    `;
    return;
  }

  wrap.innerHTML = `
    <img src="${nftLogo(f.logo)}">
    <h3>${f.collection_name}</h3>
    <p>${f.artist_name}</p>
  `;
}

/* GRID */
function renderCards(filter) {
  const grid = document.getElementById("nftGrid");
  grid.innerHTML = "";

  const tiers =
    filter === "all"
      ? ["certified", "verified", "unverified"]
      : [filter];

  tiers.forEach(tier => {
    nftData[tier].forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${nftLogo(item.logo)}">
        <h3>${item.collection_name}</h3>
        <p>${item.artist_name}</p>
        <a class="btn" target="_blank" href="${item.collection_link}">View Collection</a>
        <a class="btn" target="_blank" href="${item.website}">Visit Website</a>
      `;

      grid.appendChild(card);
    });
  });
}

/* FILTER BUTTONS */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
    renderCards(btn.dataset.filter);
  });
});
