import CollectionPage from './CollectionPage';

export default function MenPage({ onAddToCart, onCartClick, cartCount, savedItems, onSave }) {
  return (
    <CollectionPage
      category="men"
      titleOutline="BUILT"
      title="FOR MEN"
      eyebrow="MEN'S COLLECTION · SS26"
      styleFilters={['All', 'Lifestyle', 'Running', 'Racing', 'Trail', 'Slides']}
      onAddToCart={onAddToCart}
      onCartClick={onCartClick}
      cartCount={cartCount}
      savedItems={savedItems}
      onSave={onSave}
    />
  );
}
