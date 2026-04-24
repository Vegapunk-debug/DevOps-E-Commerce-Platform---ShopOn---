import CollectionPage from './CollectionPage';

export default function KidsPage({ onAddToCart, onCartClick, cartCount, savedItems, onSave }) {
  return (
    <CollectionPage
      category="kids"
      titleOutline="PLAY"
      title="ALL DAY"
      eyebrow="KIDS' COLLECTION · SS26"
      styleFilters={['All', 'Lifestyle', 'Running', 'Basketball', 'Trail', 'Slides']}
      onAddToCart={onAddToCart}
      onCartClick={onCartClick}
      cartCount={cartCount}
      savedItems={savedItems}
      onSave={onSave}
    />
  );
}
