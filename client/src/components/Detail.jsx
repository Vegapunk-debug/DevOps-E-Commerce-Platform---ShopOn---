export default function Detail({ onShopClick, product }) {
  const scrollToAbout = () => {
    const el = document.querySelector('.features-section') || document.querySelector('.crafted');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="detail" data-section="detail">
      <div className="wrap">
        <div className="detail-grid">
          <div className="detail-left">
            <div className="eyebrow mono">ShopOn TC 7900 IN ACTION <span className="dim">WMNS TC 2026</span></div>
            <h2 className="big-head">ELEVATE<br/>YOUR GAMES<br/>WITH ShopOn TC<br/>7900 'ShopOn'</h2>
          </div>
          <div className="shoe-card"></div>
          <div className="detail-right">
            <div className="cta-row">
              <button className="btn ghost" onClick={scrollToAbout}>ABOUT</button>
              <button className="btn solid" onClick={onShopClick}>SHOP NOW</button>
            </div>
            <p className="mono">
              THE ShopOn TC 7900 IS ENGINEERED FOR THOSE WHO DEMAND BOTH PERFORMANCE AND STYLE.
              WITH ITS LIGHTWEIGHT CONSTRUCTION AND INNOVATIVE CUSHIONING, THIS SHOE IS YOUR
              ULTIMATE COMPANION FOR EVERY STRIDE.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
