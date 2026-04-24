import CollectionPage from './CollectionPage';

export default function WomenPage({ onAddToCart, onCartClick, cartCount, savedItems, onSave }) {
  return (
    <CollectionPage
      category="women"
      titleOutline="MADE"
      title="FOR HER"
      eyebrow="WOMEN'S COLLECTION · SS26"
      styleFilters={['All', 'Lifestyle', 'Running', 'Training', 'Trail', 'Slides']}
      onAddToCart={onAddToCart}
      onCartClick={onCartClick}
      cartCount={cartCount}
      savedItems={savedItems}
      onSave={onSave}
    />
  );
}
