import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShopOnLogo from './ShopOnLogo';

const API = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export default function Nav({ cartCount, onCartClick, onWishlistClick, wishlistCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setAccountOpen(false); }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('.search-toggle')) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search products
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`${API}/products`)
        .then(r => r.json())
        .then(data => {
          const q = searchQuery.toLowerCase();
          setSearchResults(data.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.style.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.colorway.toLowerCase().includes(q)
          ).slice(0, 6));
        })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const navTo = (path) => { navigate(path); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="nav">
        <a className="logo" onClick={() => navTo('/')}>
          <ShopOnLogo />
          <span style={{ fontSize: 13, letterSpacing: '0.2em' }}>ShopOn</span>
        </a>
        <ul>
          <li><a className={isActive('/men') ? 'nav-active' : ''} onClick={() => navTo('/men')}>MEN</a></li>
          <li><a className={isActive('/women') ? 'nav-active' : ''} onClick={() => navTo('/women')}>WOMEN</a></li>
          <li><a className={isActive('/kids') ? 'nav-active' : ''} onClick={() => navTo('/kids')}>KIDS</a></li>
          <li><a className={isActive('/custom') ? 'nav-active' : ''} onClick={() => navTo('/custom')}>CUSTOM</a></li>
          <li><a className={isActive('/sale') ? 'nav-active' : ''} onClick={() => navTo('/sale')}>SALE</a></li>
        </ul>
        <div className="right">
          {/* Search */}
          <button className="icon-btn search-toggle" title="Search" onClick={() => { setSearchOpen(!searchOpen); setAccountOpen(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          {/* Cart */}
          <button className="icon-btn" title="Cart" onClick={onCartClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h2l2 12h10l2-8H7"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {/* Account */}
          <div className="account-wrap" ref={accountRef}>
            <button className="icon-btn" title="Account" onClick={() => { setAccountOpen(!accountOpen); setSearchOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>
              </svg>
            </button>
            {accountOpen && (
              <div className="account-dropdown">
                <div className="ad-header mono">ACCOUNT</div>
                <button onClick={() => { setAccountOpen(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>
                  Profile
                </button>
                <button onClick={() => { setAccountOpen(false); onCartClick?.(); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h2l2 12h10l2-8H7"/></svg>
                  Orders
                </button>
                <button onClick={() => { setAccountOpen(false); onWishlistClick?.(); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21C12 21 4 14.36 4 8.5 4 5.42 6.42 3 9.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0118.5 3C21.58 3 24 5.42 24 8.5 24 14.36 12 21 12 21z" transform="translate(-2,0) scale(0.92)"/></svg>
                  Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
                </button>
                <div className="ad-divider" />
                <button>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.52L22 17"/></svg>
                  Sign In
                </button>
              </div>
            )}
          </div>
          {/* Hamburger (mobile) */}
          <button className="hamburger icon-btn" onClick={() => setMenuOpen(!menuOpen)} title="Menu">
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 5l14 14M19 5L5 19"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" ref={searchRef}>
          <div className="search-inner">
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="search-input mono"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    className="search-result"
                    onClick={() => { navTo(`/${p.category}`); setSearchOpen(false); setSearchQuery(''); }}
                  >
                    <div className="sr-name">{p.name}</div>
                    <div className="sr-meta mono">{p.category.toUpperCase()} · {p.style} · ${p.salePrice || p.price}</div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="search-empty mono">NO RESULTS FOUND</div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mm-links">
          <a className={isActive('/men') ? 'active' : ''} onClick={() => navTo('/men')}>MEN</a>
          <a className={isActive('/women') ? 'active' : ''} onClick={() => navTo('/women')}>WOMEN</a>
          <a className={isActive('/kids') ? 'active' : ''} onClick={() => navTo('/kids')}>KIDS</a>
          <a className={isActive('/custom') ? 'active' : ''} onClick={() => navTo('/custom')}>CUSTOM</a>
          <a className={isActive('/sale') ? 'active' : ''} onClick={() => navTo('/sale')}>SALE</a>
        </div>
        <div className="mm-bottom mono">
          <button onClick={() => { setMenuOpen(false); onCartClick?.(); }}>BAG ({cartCount})</button>
          <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>SEARCH</button>
        </div>
      </nav>
    </>
  );
}
