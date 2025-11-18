/* Load NFT Ledger JSON */
fetch('nft_ledger.json', { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    window.nftData = data;
    renderFeatured();
    renderCards("all");
  });

/* Render featured NFT (first unverified or first certified) */
function renderFeatured() {
  const wrap = document.getElementById("featuredNFT");

  let featured =
    (nftData.certified[0]) ||
    (nftData.verified[0]) ||
    (nftData.unverified[0]);

  if (!featured) {
    wrap.innerHTML = `
      <img src="/assets/RAD_ledger.png">
      <h3>Coming Soon</h3>
      <p>No featured NFT selected.</p>
    `;
    return;
  }

  wrap.innerHTML = `
    <img src="${featured.logo.startsWith('/') ? featured.logo : '/assets/RAD_ledger.png'}">
    <h3>${featured.collection_name}</h3>
    <p>${featured.artist_name}</p>
  `;
}

/* Render grid of NFTs */
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

      let logoPath =
        item.logo && item.logo.startsWith("/")
          ? item.logo
          : "/assets/RAD_ledger.png";

      card.innerHTML = `
        <img src="${logoPath}">
        <h3>${item.collection_name}</h3>
        <p>${item.artist_name}</p>
        <a class="btn" target="_blank" href="${item.collection_link}">View Collection</a>
        <a class="btn" target="_blank" href="${item.website}">Visit Website</a>
      `;

      grid.appendChild(card);
    });
  });
}

/* Filter buttons */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
    renderCards(btn.dataset.filter);
  });
});
