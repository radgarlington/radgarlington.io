body {
  background:#f7f9ff;
  margin:0;
  font-family:Arial,system-ui;
  color:#0f172a;
}

/* Banner */
.banner {
  background:#0A74D0;
  color:#fff;
  text-align:center;
  padding:18px 10px;
  font-size:1.1rem;
  font-weight:700;
}

/* Back Button (FIXED POSITIONING) */
.back-wrap {
  text-align:center;
  margin:14px 0;
}

.back-btn {
  background:#0A74D0;
  color:#fff;
  padding:10px 18px;
  border-radius:8px;
  text-decoration:none;
  font-weight:700;
  box-shadow:0 2px 6px rgba(0,0,0,.25);
  display:inline-block;
}

/* Submit button block */
.submit-callout {
  text-align:center;
  background:#f0f6ff;
  padding:24px 10px;
  border-bottom:2px solid #d7e7ff;
}

.submit-btn {
  background:#0A74D0;
  color:#fff;
  padding:12px 20px;
  border-radius:10px;
  font-weight:700;
  border:3px solid #d4a537;
  text-decoration:none;
  display:inline-block;
}

/* Featured NFT section */
.featured-wrap {
  max-width:960px;
  margin:28px auto;
  background:#fffef7;
  border:3px solid #d4a537;
  border-radius:14px;
  padding:22px;
  box-shadow:0 4px 16px rgba(0,0,0,.1);
}

.featured-title {
  text-align:center;
  font-size:1.3rem;
  font-weight:800;
  color:#0A74D0;
  margin-bottom:12px;
}

.featured-card img {
  width:110px;
  height:110px;
  object-fit:contain;
  border-radius:12px;
  border:3px solid #0A74D0;
  background:#fff;
  display:block;
  margin:0 auto 12px;
}

/* Filters */
.filters {
  display:flex;
  justify-content:center;
  gap:16px;
  margin:20px auto;
}

.filter-btn {
  background:#e5e7eb;
  padding:8px 16px;
  border-radius:8px;
  font-weight:700;
  cursor:pointer;
}

.filter-btn.active {
  background:#0A74D0;
  color:#fff;
}

/* NFT Grid */
.grid {
  max-width:1100px;
  margin:0 auto 50px;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:22px;
  padding:0 14px;
}

/* Cards */
.card {
  background:#fff;
  padding:18px;
  border-radius:14px;
  box-shadow:0 4px 12px rgba(0,0,0,.08);
  text-align:center;
}

.card img {
  width:110px;
  height:110px;
  object-fit:contain;
  border-radius:12px;
  border:3px solid #0A74D0;
  background:#fff;
  display:block;
  margin:0 auto 12px;
}

.card h3 {
  margin:10px 0 4px;
  font-size:1.1rem;
  color:#083c80;
}

.card p {
  margin:4px 0 12px;
  color:#475569;
}

.card .btn {
  display:block;
  margin:6px auto;
  background:#0A74D0;
  color:#fff;
  padding:8px 14px;
  border-radius:8px;
  text-decoration:none;
  font-weight:700;
}
