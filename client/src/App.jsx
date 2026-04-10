import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Elevate from './components/Elevate';
import Detail from './components/Detail';
import Crafted from './components/Crafted';
import Features from './components/Features';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import ProgressRail from './components/ProgressRail';
import ProductOverlay from './components/ProductOverlay';
import CartDrawer from './components/CartDrawer';
import ShoeScene from './components/ShoeScene';
import MenPage from './components/MenPage';
import WomenPage from './components/WomenPage';
import KidsPage from './components/KidsPage';
import CustomPage from './components/CustomPage';
import SalePage from './components/SalePage';
import PageTransition from './components/PageTransition';
import FlyToCartLayer, { useFlyToCart } from './components/FlyToCart';

const API = 'http://localhost:3001/api';

function ScrollToTop() {
  return null;
}

function ShoeSceneWrapper() {
  const { pathname } = useLocation();
  if (pathname !== '/') return null;
  return <ShoeScene onLoaded={() => {}} />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [productOpen, setProductOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState('');
  const [savedItems, setSavedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopon_wishlist') || '[]'); } catch { return []; }
  });
  const { flyItems, triggerFly } = useFlyToCart();

  useEffect(() => {
    fetch(`${API}/products?featured=true`)
      .then(r => r.json())
      .then(data => { if (data.length > 0) setProduct(data[0]); })
      .catch(() => {
        setProduct({
          id: 1, name: "TC 7900 'ShopOn'", subtitle: 'WMNS · SS26', price: 185,
          description: 'Engineered for those who demand both performance and style.',
          sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10'],
          weight: '248g', drop: '8mm', rating: 4.9,
        });
      });
  }, []);

  const fetchCart = useCallback(() => {
    fetch(`${API}/cart`).then(r => r.json()).then(setCartItems).catch(() => {});
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('shopon_wishlist', JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleSave = (productId) => {
    setSavedItems(prev => {
      if (prev.includes(productId)) {
        showToast('REMOVED FROM WISHLIST');
        return prev.filter(id => id !== productId);
      } else {
        showToast('ADDED TO WISHLIST');
        return [...prev, productId];
      }
    });
  };

  const addToCart = async (productId, size, sourceEl) => {
    if (sourceEl) {
      triggerFly(sourceEl);
      setTimeout(() => {
        const cartBtn = document.querySelector('.icon-btn[title="Cart"]');
        if (cartBtn) {
          cartBtn.classList.remove('cart-bounce');
          void cartBtn.offsetWidth;
          cartBtn.classList.add('cart-bounce');
          setTimeout(() => cartBtn.classList.remove('cart-bounce'), 500);
        }
      }, 700);
    }

    try {
      await fetch(`${API}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, size }),
      });
      fetchCart();
      showToast('ADDED TO BAG');
    } catch {
      showToast('ADDED TO BAG (OFFLINE)');
    }
  };

  const removeFromCart = async (id) => {
    try {
      await fetch(`${API}/cart/${id}`, { method: 'DELETE' });
      fetchCart();
    } catch {
      setCartItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {loading && <Loader onDone={() => setLoading(false)} />}

      <Nav
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onWishlistClick={() => showToast(`WISHLIST: ${savedItems.length} ITEM${savedItems.length !== 1 ? 'S' : ''} SAVED`)}
        wishlistCount={savedItems.length}
      />

      <ShoeSceneWrapper />

      <PageTransition>
        <Routes>
          <Route path="/" element={
            <>
              <ProgressRail />
              <main>
                <Hero />
                <Elevate />
                <Detail onShopClick={() => setProductOpen(true)} product={product} />
                <Crafted />
                <Features />
                <CtaSection onShopClick={() => setProductOpen(true)} price={product?.price} />
              </main>
              <Footer />
              <ProductOverlay
                product={product}
                open={productOpen}
                onClose={() => setProductOpen(false)}
                onAddToCart={addToCart}
                onCartClick={() => setCartOpen(true)}
                cartCount={cartCount}
                onSave={toggleSave}
                saved={product ? savedItems.includes(product.id) : false}
              />
            </>
          } />
          <Route path="/men" element={<MenPage onAddToCart={addToCart} onCartClick={() => setCartOpen(true)} cartCount={cartCount} savedItems={savedItems} onSave={toggleSave} />} />
          <Route path="/women" element={<WomenPage onAddToCart={addToCart} onCartClick={() => setCartOpen(true)} cartCount={cartCount} savedItems={savedItems} onSave={toggleSave} />} />
          <Route path="/kids" element={<KidsPage onAddToCart={addToCart} onCartClick={() => setCartOpen(true)} cartCount={cartCount} savedItems={savedItems} onSave={toggleSave} />} />
          <Route path="/custom" element={<CustomPage onAddToCart={addToCart} onCartClick={() => setCartOpen(true)} cartCount={cartCount} savedItems={savedItems} onSave={toggleSave} />} />
          <Route path="/sale" element={<SalePage onAddToCart={addToCart} onCartClick={() => setCartOpen(true)} cartCount={cartCount} savedItems={savedItems} onSave={toggleSave} />} />
        </Routes>
      </PageTransition>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
      />

      <FlyToCartLayer flyItems={flyItems} />
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </BrowserRouter>
  );
}

export default App;
