// Load NFT ledger JSON
fetch('nft_ledger.json')
  .then(res => res.json())
  .then(data => {
    window.nftData = data;
renderFeatured();
renderCards('all');
  });

// Render Featured NFT (first entry in certified, then verified, fallback unverified)
function renderFeatured(){
  const f = window.nftData;

  let pick =
    (f.certified.length ? f.certified[0] :
    (f.verified.length ? f.verified[0] :
    (f.unverified.length ? f.unverified[0] : null)));

  if(!pick) return;

  const box = document.getElementById('featuredNFT');

  box.innerHTML = `
    <img src="${pick.logo.startsWith('/') ? pick.logo : 'static/logos/' + pick.logo}">
    <h3>${pick.collection_name}</h3>
    <p>${pick.artist_name}</p>
    <a target="_blank" href="${pick.collection_link}">View</a>
    <a target="_blank" href="${pick.website}">Site</a>
  `;
}


// Render cards into the grid
function renderCards(filter){
  const grid = document.getElementById('nftGrid');
  grid.innerHTML = '';

  const tiers = filter === 'all'
    ? ['certified','verified','unverified']
    : [filter];

  tiers.forEach(tier => {
    window.nftData[tier].forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
<img src="${item.logo.startsWith('/') ? item.logo : 'static/logos/' + item.logo}">
        <h3>${item.collection_name}</h3>
        <p>${item.artist_name}</p>
        <a class="btn" target="_blank" href="${item.collection_link}">View Collection</a>
        <a class="btn" target="_blank" href="${item.website}">Visit Website</a>
      `;

      grid.appendChild(card);
    });
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.filter);
  });
});
