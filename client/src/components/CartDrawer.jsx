import { useState } from 'react';

export default function CartDrawer({ open, onClose, items, onRemove }) {
  const [checkoutDone, setCheckoutDone] = useState(false);
  const total = items.reduce((sum, i) => sum + (i.product?.salePrice || i.product?.price || 0) * i.quantity, 0);

  const handleCheckout = () => {
    setCheckoutDone(true);
  };

  const handleContinue = () => {
    setCheckoutDone(false);
    onClose();
  };

  return (
    <>
      <div className={`cart-drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{checkoutDone ? 'ORDER CONFIRMED' : `YOUR BAG (${items.length})`}</h3>
          <button className="icon-btn" onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 5l14 14M19 5L5 19"/>
            </svg>
          </button>
        </div>

        {checkoutDone ? (
          <div className="checkout-success">
            <div className="cs-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l3 3 5-6"/>
              </svg>
            </div>
            <h4>THANK YOU</h4>
            <p className="mono" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--muted)', lineHeight: 1.8, textAlign: 'center' }}>
              YOUR ORDER HAS BEEN PLACED.<br/>
              ORDER #{Math.random().toString(36).slice(2, 8).toUpperCase()}<br/>
              ESTIMATED DELIVERY: 3–5 BUSINESS DAYS
            </p>
            <div className="cs-summary">
              {items.map(item => (
                <div key={item.id} className="cs-item mono">
                  <span>{item.product?.name || 'TC 7900'} · SIZE {item.size}</span>
                  <span>${(item.product?.salePrice || item.product?.price || 185) * item.quantity}</span>
                </div>
              ))}
              <div className="cs-total">
                <span>TOTAL</span>
                <span>${total}</span>
              </div>
            </div>
            <button className="btn solid" style={{ width: '100%', marginTop: 24 }} onClick={handleContinue}>
              CONTINUE SHOPPING
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 40, textAlign: 'center', letterSpacing: '0.2em' }}>
            BAG IS EMPTY
          </p>
        ) : (
          <>
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <div className="name">{item.product?.name || 'TC 7900'}</div>
                  <div className="size-qty mono">SIZE {item.size} · QTY {item.quantity}</div>
                  {item.product?.colorway && (
                    <div className="size-qty mono" style={{ marginTop: 2 }}>{item.product.colorway}</div>
                  )}
                </div>
                <div style={{ fontWeight: 700, marginRight: 16 }}>
                  ${(item.product?.salePrice || item.product?.price || 185) * item.quantity}
                </div>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
              </div>
            ))}
            <div className="cart-subtotals">
              <div className="cs-row mono"><span>SUBTOTAL</span><span>${total}</span></div>
              <div className="cs-row mono"><span>SHIPPING</span><span>FREE</span></div>
              <div className="cs-row mono"><span>TAX</span><span>${(total * 0.08).toFixed(2)}</span></div>
            </div>
            <div className="cart-total">
              <span>TOTAL</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
            <button className="btn solid" style={{ width: '100%', marginTop: 20 }} onClick={handleCheckout}>
              CHECKOUT · ${(total * 1.08).toFixed(2)}
            </button>
            <p className="mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--muted)', textAlign: 'center', marginTop: 12 }}>
              FREE SHIPPING · FREE RETURNS · 30 DAY GUARANTEE
            </p>
          </>
        )}
      </div>
    </>
  );
}
