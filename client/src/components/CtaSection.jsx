import { useState } from 'react';

const STORES = [
  { city: 'NEW YORK', address: '550 Broadway, SoHo', hours: 'MON-SAT 10AM-8PM · SUN 11AM-7PM' },
  { city: 'LOS ANGELES', address: '8500 Beverly Blvd, Beverly Center', hours: 'MON-SAT 10AM-9PM · SUN 11AM-7PM' },
  { city: 'CHICAGO', address: '900 N Michigan Ave', hours: 'MON-SAT 10AM-8PM · SUN 12PM-6PM' },
  { city: 'LONDON', address: '196 Oxford Street, W1', hours: 'MON-SAT 10AM-9PM · SUN 12PM-6PM' },
  { city: 'TOKYO', address: 'Omotesando Hills, Shibuya', hours: 'DAILY 11AM-9PM' },
  { city: 'PARIS', address: '64 Champs-Élysées, 8e', hours: 'MON-SAT 10AM-8PM · SUN 11AM-7PM' },
];

export default function CtaSection({ onShopClick, price }) {
  const [storeOpen, setStoreOpen] = useState(false);

  return (
    <>
      <section className="cta-section" data-section="cta" style={{ padding: '96px 40px 0' }}>
        <div className="wrap">
          <h2>
            <div className="outline">MOVE</div>
            <div>FIRST.</div>
          </h2>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn solid" onClick={onShopClick}>SHOP NOW · ${price || 185}</button>
            <button className="btn ghost" onClick={() => setStoreOpen(true)}>FIND A STORE</button>
          </div>
        </div>
      </section>

      {/* Store Locator Modal */}
      {storeOpen && (
        <div className="store-modal-overlay" onClick={() => setStoreOpen(false)}>
          <div className="store-modal" onClick={e => e.stopPropagation()}>
            <div className="sm-header">
              <h3>FIND A STORE</h3>
              <button className="sm-close" onClick={() => setStoreOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 5l14 14M19 5L5 19"/>
                </svg>
              </button>
            </div>
            <p className="mono sm-subtitle">ShopOn FLAGSHIP LOCATIONS WORLDWIDE</p>
            <div className="store-grid">
              {STORES.map(s => (
                <div className="store-card" key={s.city}>
                  <div className="sc-city">{s.city}</div>
                  <div className="sc-address">{s.address}</div>
                  <div className="sc-hours mono">{s.hours}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
