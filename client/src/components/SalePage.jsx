import CollectionPage from './CollectionPage';

export default function SalePage({ onAddToCart, onCartClick, cartCount, savedItems, onSave }) {
  return (
    <CollectionPage
      category={null}
      titleOutline="UP TO"
      title="40% OFF"
      eyebrow="SALE · LIMITED TIME"
      isSale
      onAddToCart={onAddToCart}
      onCartClick={onCartClick}
      cartCount={cartCount}
      savedItems={savedItems}
      onSave={onSave}
    />
  );
}
