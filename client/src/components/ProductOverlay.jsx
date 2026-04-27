import { useState } from 'react';

export default function ProductOverlay({ product, open, onClose, onAddToCart, onCartClick, cartCount, onSave, saved }) {
  const [selectedSize, setSelectedSize] = useState('7.5');

  if (!product) return null;

  const sizes = product.sizes || ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"];

  return (
    <div className={`product-overlay ${open ? 'on' : ''}`}>
      <div className="po-top-bar">
        <button className="close" onClick={onClose}>
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
          <div className="tag mono">// 3D · 360° VIEW</div>
          <div className="big-img">
            {product.image ? (
              <img src={import.meta.env.PROD ? product.image.replace('http://localhost:3001', '') : product.image} alt={product.name} className="po-product-img" />
            ) : (
              <span className="mono" style={{ color: 'var(--muted)', fontSize: 11 }}>PRODUCT IMAGE</span>
            )}
          </div>
        </div>
        <div className="po-info">
          <div className="eyebrow mono">ShopOn TC 7900 <span className="dim">WMNS · SS26</span></div>
          <h1>TC 7900<br/>'ShopOn'</h1>
          <div className="price">${product.price} USD</div>
          <p className="desc">{product.description}</p>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 10 }}>SIZE (US)</div>
          <div className="size-row">
            {sizes.map(s => (
              <div
                key={s}
                className={`size ${s === selectedSize ? 'sel' : ''}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="po-cta">
            <button
              className="btn solid"
              style={{ flex: 1 }}
              onClick={(e) => onAddToCart(product.id, selectedSize, e.currentTarget)}
            >
              ADD TO BAG
            </button>
            <button className={`btn ghost ${saved ? 'saved' : ''}`} onClick={() => onSave?.(product.id)}>
              {saved ? '♥ SAVED' : '♡ SAVE'}
            </button>
          </div>
          <div className="po-meta">
            <div className="m"><h6>WEIGHT</h6><p>{product.weight}</p></div>
            <div className="m"><h6>DROP</h6><p>{product.drop}</p></div>
            <div className="m"><h6>RATING</h6><p>{'★'.repeat(Math.floor(product.rating))} {product.rating}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
