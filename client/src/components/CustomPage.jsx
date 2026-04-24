import CollectionPage from './CollectionPage';

export default function CustomPage({ onAddToCart, onCartClick, cartCount, savedItems, onSave }) {
  return (
    <CollectionPage
      category="custom"
      titleOutline="DESIGN"
      title="YOUR OWN"
      eyebrow="ShopOn BY YOU · CUSTOM STUDIO"
      styleFilters={['All', 'Lifestyle', 'Running', 'Trail']}
      onAddToCart={onAddToCart}
      onCartClick={onCartClick}
      cartCount={cartCount}
      savedItems={savedItems}
      onSave={onSave}
    />
  );
}
