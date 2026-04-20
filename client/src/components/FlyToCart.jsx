import { useState, useCallback } from 'react';

const ShoeSVG = () => (
  <svg viewBox="0 0 200 120" fill="none" width="120" height="72">
    <path d="M30 90 Q30 50 60 40 Q90 30 130 35 Q160 38 175 50 Q185 58 185 70 L185 90 Z"
      fill="#0b0b0b" opacity="0.15" />
    <path d="M35 88 Q35 55 62 45 Q88 35 128 38 Q155 42 170 52 Q180 58 180 68 L180 88 Z"
      stroke="#0b0b0b" strokeWidth="2" fill="none" />
    <path d="M180 88 L25 88" stroke="#0b0b0b" strokeWidth="3" />
    <path d="M60 72 Q100 55 155 62" stroke="#0b0b0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export function useFlyToCart() {
  const [flyItems, setFlyItems] = useState([]);

  const triggerFly = useCallback((sourceEl) => {
    // Get source position (the button or image that triggered it)
    const sourceRect = sourceEl?.getBoundingClientRect();
    if (!sourceRect) return;

    // Get cart icon positi
    const cartBtn = document.querySelector('.icon-btn[title="Cart"]');
    const cartRect = cartBtn?.getBoundingClientRect();
    if (!cartRect) return;

    const id = Date.now();
    const item = {
      id,
      startX: sourceRect.left + sourceRect.width / 2 - 60,
      startY: sourceRect.top + sourceRect.height / 2 - 36,
      endX: cartRect.left + cartRect.width / 2 - 60,
      endY: cartRect.top + cartRect.height / 2 - 36,
    };

    setFlyItems(prev => [...prev, item]);

    // Remove after animation
    setTimeout(() => {
      setFlyItems(prev => prev.filter(f => f.id !== id));
    }, 900);
  }, []);

  return { flyItems, triggerFly };
}

export default function FlyToCartLayer({ flyItems }) {
  return (
    <div className="fly-to-cart-layer">
      {flyItems.map(item => {
        const dx = item.endX - item.startX;
        const dy = item.endY - item.startY;

        return (
          <div
            key={item.id}
            className="fly-item"
            style={{
              '--start-x': `${item.startX}px`,
              '--start-y': `${item.startY}px`,
              '--end-x': `${item.endX}px`,
              '--end-y': `${item.endY}px`,
              '--mid-x': `${item.startX + dx * 0.5}px`,
              '--mid-y': `${Math.min(item.startY, item.endY) - 120}px`,
            }}
          >
            <ShoeSVG />
          </div>
        );
      })}
    </div>
  );
}
