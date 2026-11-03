import { useState, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
const logo = "https://pub-53f55a87e6f64c51862dbd0fa933eee1.r2.dev/common/logo_1.webp";
import './Navbar.css';

const subscribeToScroll = (callback) => {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
};
const getScrollSnapshot = () => window.scrollY > 100;
const getServerScrollSnapshot = () => false;

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isScrolled = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getServerScrollSnapshot);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className={`boutique-nav ${(!isHomePage || isScrolled) ? 'nav-full-visible' : 'nav-logo-only'} ${isMenuOpen ? 'menu-is-open' : ''}`}>
        <div className="nav-container">

          <div className="nav-left">
            <Link to="/" className="nav-brand-link">
              <img src={logo} alt="Shoot At Sight Weddings" className="nav-logo" />
              <span className="nav-brand-tagline">WEDDING PHOTOGRAPHERS & FILMMAKERS</span>
            </Link>
          </div>

          <div className="nav-right">
            <div className="nav-links">
              <Link to="/" className="nav-link-item">HOME</Link>
              <Link to="/about" className="nav-link-item">ABOUT</Link>
              <Link to="/portfolio" className="nav-link-item">PORTFOLIO</Link>
              <Link to="/films" className="nav-link-item">FILMS</Link>
              <Link to="/blog" className="nav-link-item">BLOG</Link>
              <Link to="/faq" className="nav-link-item">FAQ</Link>
              <Link to="/contact" className="nav-link-item">CONTACT</Link>
            </div>

            <Link to="/contact" className="nav-cta-pill-camera">
              <svg className="nav-camera-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18.5" cy="8.5" r="0.5" fill="currentColor"/>
              </svg>
              <span>START A CONVERSATION</span>
            </Link>
          </div>

          {/* Luxury Minimalist Hamburger Button (Visible only on mobile) */}
          <button
            className={`mobile-hamburger-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span className="hamburger-line line-top"></span>
            <span className="hamburger-line line-bottom"></span>
          </button>

        </div>
      </nav>

      {/* Fullscreen Luxury Slide Drawer Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-inner">

          <div className="mobile-menu-links">
            <Link to="/" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>01 //</span> HOME
            </Link>
            <Link to="/about" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>02 //</span> ABOUT
            </Link>
            <Link to="/portfolio" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>03 //</span> PORTFOLIO
            </Link>
            <Link to="/films" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>04 //</span> FILMS
            </Link>
            <Link to="/blog" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>05 //</span> BLOG
            </Link>
            <Link to="/faq" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>06 //</span> FAQ
            </Link>
            <Link to="/contact" className="mobile-menu-link-item" onClick={toggleMenu}>
              <span>07 //</span> CONTACT
            </Link>
          </div>


          <div className="mobile-menu-footer">
            <span className="mobile-menu-tagline">NOW BOOKING 2026 / 2027</span>
            <a
              href="https://wa.me/919900233338"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-cta"
              onClick={toggleMenu}
            >
              Start a Conversation
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
