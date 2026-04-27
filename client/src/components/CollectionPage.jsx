import { useState, useEffect } from 'react';
import Footer from './Footer';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const CARD_PALETTES = [
  { bg: '#e8e4dc', accent: '#0b0b0b' },
  { bg: '#1a1a1a', accent: '#f5f0e8' },
  { bg: '#2c3e50', accent: '#ecf0f1' },
  { bg: '#d4c5a9', accent: '#2c1810' },
  { bg: '#f0e6d3', accent: '#0b0b0b' },
  { bg: '#3d3d3d', accent: '#e8e4dc' },
  { bg: '#1b2838', accent: '#66c0f4' },
  { bg: '#e0ddd5', accent: '#0b0b0b' },
  { bg: '#2d2d2d', accent: '#ff6b35' },
  { bg: '#4a1942', accent: '#f5e6ff' },
  { bg: '#0d4b3c', accent: '#a8e6cf' },
  { bg: '#f5e6cc', accent: '#5d4037' },
];

function ShoeCard({ product, index, onClick, showSale }) {
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const isDark = palette.bg.startsWith('#1') || palette.bg.startsWith('#2') || palette.bg.startsWith('#3') || palette.bg.startsWith('#4') || palette.bg.startsWith('#0');
  const hasSale = showSale && product.salePrice;

  return (
    <div className="shoe-product-card" onClick={() => onClick(product)} style={{ cursor: 'pointer' }}>
      <div className="spc-image" style={{ background: palette.bg }}>
        {product.featured && !hasSale && <span className="spc-badge">FEATURED</span>}
        {hasSale && <span className="spc-badge spc-badge-sale">SALE</span>}
        {product.customizable && <span className="spc-badge spc-badge-custom">CUSTOMIZE</span>}
        {product.image ? (
          <img
            className="spc-shoe-img"
            src={import.meta.env.PROD ? product.image.replace('http://localhost:3001', '') : product.image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="spc-shoe-visual" style={{ color: palette.accent }}>
            <svg viewBox="0 0 200 120" fill="none" width="160" height="96">
              <path d="M30 90 Q30 50 60 40 Q90 30 130 35 Q160 38 175 50 Q185 58 185 70 L185 90 Z"
                fill={palette.accent} opacity="0.15" />
              <path d="M35 88 Q35 55 62 45 Q88 35 128 38 Q155 42 170 52 Q180 58 180 68 L180 88 Z"
                stroke={palette.accent} strokeWidth="2" fill="none" />
              <path d="M180 88 L25 88" stroke={palette.accent} strokeWidth="3" />
            </svg>
          </div>
        )}
        <span className="spc-colorway mono" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
          {product.colorway}
        </span>
      </div>
      <div className="spc-info">
        <div className="spc-style mono">{product.style}{product.customizable ? ' · BY YOU' : ''}</div>
        <h3 className="spc-name">{product.name}</h3>
        <div className="spc-meta">
          {hasSale ? (
            <span className="spc-price">
              <span className="spc-price-old">${product.price}</span> ${product.salePrice}
            </span>
          ) : (
            <span className="spc-price">${product.price}</span>
          )}
          <span className="spc-rating">{'★'.repeat(Math.floor(product.rating))} {product.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage({
  category,
  title,
  titleOutline,
  eyebrow,
  styleFilters,
  isSale,
  onAddToCart,
  onCartClick,
  cartCount,
  savedItems = [],
  onSave,
}) {
  const [shoes, setShoes] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (isSale) params.set('sale', 'true');
    if (filter !== 'All') params.set('style', filter);
    fetch(`${API}/products?${params}`)
      .then(r => r.json())
      .then(data => {
        let sorted = [...data];
        if (sort === 'price-low') sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        else if (sort === 'price-high') sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
        else if (sort === 'discount' && isSale) sorted.sort((a, b) => {
          const da = a.salePrice ? (a.price - a.salePrice) / a.price : 0;
          const db = b.salePrice ? (b.price - b.salePrice) / b.price : 0;
          return db - da;
        });
        setShoes(sorted);
      })
      .catch(() => {});
  }, [filter, sort, category, isSale]);

  const featured = shoes.filter(s => s.featured);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[3] || product.sizes?.[0]);
    document.body.style.overflow = 'hidden';
  };
  const closeProduct = () => {
    setSelectedProduct(null);
    document.body.style.overflow = '';
  };

  // Reset scroll lock on unmount (navigating away with overlay open)
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  const handleAddToCart = (e) => {
    if (selectedProduct && selectedSize) {
      onAddToCart(selectedProduct.id, selectedSize, e?.currentTarget);
    }
  };

  // Compute unique styles for dynamic filters
  const dynamicStyles = styleFilters || ['All', ...new Set(shoes.map(s => s.style))];

  return (
    <>
      <main className="men-page">
        {/* HERO */}
        <section className="men-hero">
          <div className="wrap">
            <div className="men-hero-eyebrow mono">{eyebrow}</div>
            <h1 className="men-hero-title">
              <span className="men-hero-outline">{titleOutline}</span>
              <br />
              <span>{title}</span>
            </h1>
            <p className="men-hero-sub mono">
              {shoes.length} STYLES{isSale ? ' · UP TO 40% OFF' : ''}
              {category === 'custom' ? ' · DESIGN YOUR OWN' : ''}
            </p>
          </div>
        </section>

        {/* FEATURED */}
        {!isSale && featured.length > 0 && (
          <section className="men-featured">
            <div className="wrap">
              <div className="eyebrow mono">{category === 'custom' ? 'MOST POPULAR' : "EDITOR'S PICKS"}</div>
              <h2 className="men-section-head">FEATURED</h2>
              <div className="men-featured-grid">
                {featured.map((shoe, i) => (
                  <ShoeCard key={shoe.id} product={shoe} index={i} onClick={openProduct} showSale={isSale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SALE BANNER */}
        {isSale && (
          <section className="sale-banner">
            <div className="wrap">
              <div className="sale-banner-inner">
                <span className="sale-tag mono">LIMITED TIME</span>
                <h2>UP TO 40% OFF SELECT STYLES</h2>
                <p className="mono">PRICES AS MARKED · NO CODE NEEDED · WHILE SUPPLIES LAST</p>
              </div>
            </div>
          </section>
        )}

        {/* FILTER + GRID */}
        <section className="men-collection">
          <div className="wrap">
            <div className="men-filter-bar">
              <div className="men-filters">
                {dynamicStyles.map(f => (
                  <button
                    key={f}
                    className={`men-filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <select className="men-sort" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="newest">NEWEST</option>
                <option value="price-low">PRICE: LOW → HIGH</option>
                <option value="price-high">PRICE: HIGH → LOW</option>
                <option value="rating">TOP RATED</option>
                {isSale && <option value="discount">BIGGEST DISCOUNT</option>}
              </select>
            </div>

            <div className="men-grid">
              {shoes.map((shoe, i) => (
                <ShoeCard key={shoe.id} product={shoe} index={i + 3} onClick={openProduct} showSale={isSale} />
              ))}
            </div>

            {shoes.length === 0 && (
              <div className="men-empty mono">NO SHOES FOUND FOR THIS FILTER</div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* PRODUCT OVERLAY */}
      {selectedProduct && (
        <div className="product-overlay on">
          <div className="po-top-bar">
            <button className="close" onClick={closeProduct}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 5l14 14M19 5L5 19"/>
              </svg>
            </button>
            {onCartClick && (
              <button className="po-cart-btn" onClick={onCartClick} title="View Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h2l2 12h10l2-8H7"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>
                </svg>
                {cartCount > 0 && <span className="po-cart-badge">{cartCount}</span>}
              </button>
            )}
          </div>
          <div className="po-wrap">
            <div className="po-gallery">
              <div className="tag mono">// {selectedProduct.style.toUpperCase()}{selectedProduct.customizable ? ' · CUSTOMIZABLE' : ''}</div>
              <div className="big-img">
                {selectedProduct.image ? (
                  <img src={import.meta.env.PROD ? selectedProduct.image.replace('http://localhost:3001', '') : selectedProduct.image} alt={selectedProduct.name} className="po-product-img" />
                ) : (
                  <span className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>PRODUCT IMAGE</span>
                )}
              </div>
            </div>
            <div className="po-info">
              <div className="eyebrow mono">{selectedProduct.name} <span className="dim">{selectedProduct.subtitle}</span></div>
              <h1>{selectedProduct.name}</h1>
              {selectedProduct.salePrice ? (
                <div className="price">
                  <span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: 12 }}>${selectedProduct.price}</span>
                  <span style={{ color: '#c0392b' }}>${selectedProduct.salePrice} USD</span>
                </div>
              ) : (
                <div className="price">${selectedProduct.price} USD</div>
              )}
              <p className="desc">{selectedProduct.description}</p>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 10 }}>
                SIZE{category === 'kids' ? '' : ' (US)'} · {selectedProduct.colorway}
              </div>
              <div className="size-row">
                {selectedProduct.sizes?.map(s => (
                  <div key={s} className={`size ${s === selectedSize ? 'sel' : ''}`} onClick={() => setSelectedSize(s)}>{s}</div>
                ))}
              </div>
              <div className="po-cta">
                <button className="btn solid" style={{ flex: 1 }} onClick={(e) => handleAddToCart(e)}>
                  {selectedProduct.customizable ? 'START CUSTOMIZING' : 'ADD TO BAG'}
                </button>
                <button
                  className={`btn ghost ${savedItems.includes(selectedProduct.id) ? 'saved' : ''}`}
                  onClick={() => onSave?.(selectedProduct.id)}
                >
                  {savedItems.includes(selectedProduct.id) ? '♥ SAVED' : '♡ SAVE'}
                </button>
              </div>
              <div className="po-meta">
                <div className="m"><h6>WEIGHT</h6><p>{selectedProduct.weight}</p></div>
                <div className="m"><h6>DROP</h6><p>{selectedProduct.drop}</p></div>
                <div className="m"><h6>RATING</h6><p>{'★'.repeat(Math.floor(selectedProduct.rating))} {selectedProduct.rating}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
