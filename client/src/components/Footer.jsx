import { useNavigate } from 'react-router-dom';
import ShopOnLogo from './ShopOnLogo';

export default function Footer() {
  const navigate = useNavigate();

  const scrollTo = (selector) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer>
      <div className="foot-wrap">
        <div className="foot-brand">
          <ShopOnLogo width={80} height={30} />
          <div style={{ fontSize: 13, opacity: 0.75, maxWidth: 300, lineHeight: 1.6 }}>
            Concept athletic footwear website. Original brand exploration — not affiliated with any real manufacturer.
          </div>
          <div className="socials">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h4l-5 6 6 12h-5l-3.5-7L5 21H1l6-7L1 3h5l3 6z"/></svg></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1zM8 18H5V9h3v9zM6.5 7.7a1.7 1.7 0 110-3.4 1.7 1.7 0 010 3.4zM19 18h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.5V18h-3V9h2.9v1.2h.1c.4-.8 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V18z"/></svg></a>
          </div>
        </div>
        <div className="foot-col">
          <h5>GALLERY</h5>
          <ul>
            <li><a onClick={() => scrollTo('.crafted')}>Lookbook</a></li>
            <li><a onClick={() => scrollTo('.hero')}>Campaigns</a></li>
            <li><a onClick={() => navigate('/sale')}>Archive</a></li>
            <li><a onClick={() => scrollTo('.elevate')}>Press</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>COMPANY</h5>
          <ul>
            <li><a onClick={() => scrollTo('.features-section')}>About</a></li>
            <li><a onClick={() => scrollTo('.crafted')}>Sustainability</a></li>
            <li><a onClick={() => scrollTo('.cta-section')}>Careers</a></li>
            <li><a onClick={() => scrollTo('.cta-section')}>Stores</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>HELP</h5>
          <ul>
            <li><a onClick={() => scrollTo('.cta-section')}>Contact</a></li>
            <li><a onClick={() => scrollTo('.features-section')}>Shipping</a></li>
            <li><a onClick={() => scrollTo('.features-section')}>Returns</a></li>
            <li><a onClick={() => scrollTo('footer')}>Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom mono">© 2026 ShopOn — CONCEPT WEBSITE · BUILT FOR DEMO ONLY</div>
    </footer>
  );
}
