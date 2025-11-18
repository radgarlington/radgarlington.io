/* Load NFT Ledger JSON */
fetch('nft_ledger.json', { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    window.nftData = data;
    renderFeatured();
    renderCards("all");
  });

/* ALWAYS resolve logo properly */
function getLogoPath(raw) {
  // If missing or empty → force placeholder
  if (!raw || raw.trim() === "") {
    return "/assets/RAD_ledger.png";
  }

  // If the entry contains the right file name → force correct absolute path
  if (raw.includes("RAD_ledger.png")) {
    return "/assets/RAD_ledger.png";
  }

  // If it's already an absolute path
  if (raw.startsWith("/")) {
    return raw;
  }

  // Final fallback
  return "/assets/RAD_ledger.png";
}

/* Render Featured NFT */
function renderFeatured() {
  const wrap = document.getElementById("featuredNFT");

  let featured =
    nftData.certified[0] ||
    nftData.verified[0] ||
    nftData.unverified[0];

  if (!featured) {
    wrap.innerHTML = `
      <img src="/assets/RAD_ledger.png">
      <h3>Coming Soon</h3>
      <p>No featured NFT selected.</p>
    `;
    return;
  }

  const logo = getLogoPath(featured.logo);

  wrap.innerHTML = `
    <img src="${logo}">
    <h3>${featured.collection_name}</h3>
    <p>${featured.artist_name}</p>
  `;
}

/* Render Cards */
function renderCards(filter) {
  const grid = document.getElementById("nftGrid");
  grid.innerHTML = "";

  const tiers = filter === "all"
    ? ["certified", "verified", "unverified"]
    : [filter];

  tiers.forEach(tier => {
    nftData[tier].forEach(item => {

      const card = document.createElement("div");
      card.className = "card";

      const logo = getLogoPath(item.logo);

      card.innerHTML = `
        <img src="${logo}">
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
    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    renderCards(btn.dataset.filter);
  });
});
