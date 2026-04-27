import { useState, useEffect } from 'react';

export default function Features() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.PROD ? '/api/features' : 'http://localhost:3001/api/features')
      .then(r => r.json())
      .then(setFeatures)
      .catch(() => {
        // Fallback if server not running
        setFeatures([
          { id: 1, number: '01', category: 'CUSHIONING', title: 'ShopOn AIR — 24MM DROP', description: 'RESPONSIVE FOAM UNDERFOOT · 12% MORE ENERGY RETURN' },
          { id: 2, number: '02', category: 'UPPER', title: 'RECYCLED KNIT MESH', description: '70% POST-CONSUMER YARN · BREATHABLE 4-WAY STRETCH' },
          { id: 3, number: '03', category: 'OUTSOLE', title: 'HEX RUBBER GRID', description: 'MULTI-SURFACE TRACTION · WET & DRY TESTED' },
        ]);
      });
  }, []);

  return (
    <section className="features-section" data-section="features" style={{ padding: '96px 40px 0' }}>
      <div className="wrap">
        <div className="eyebrow mono">SPECS · 2026 CONCEPT</div>
        <h2 className="crafted-head" style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}>BUILT FOR<br/>EVERY STRIDE</h2>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature" key={f.id}>
              <span className="num mono">{f.number} / {f.category}</span>
              <h3>{f.title}</h3>
              <p className="mono">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
