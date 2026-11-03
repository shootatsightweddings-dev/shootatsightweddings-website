import { Link, useLocation } from 'react-router-dom';
import './MobileAppTabBar.css';

const MobileAppTabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="mobile-app-tab-bar">
      <div className="mobile-tab-bar-container">

        {/* Tab 1: HOME */}
        <Link
          to="/"
          className={`mobile-tab-item ${currentPath === '/' ? 'active' : ''}`}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tab-label">Home</span>
        </Link>

        {/* Tab 2: ABOUT */}
        <Link
          to="/about"
          className={`mobile-tab-item ${currentPath === '/about' ? 'active' : ''}`}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tab-label">About</span>
        </Link>

        {/* Tab 3: PORTFOLIO */}
        <Link
          to="/portfolio"
          className={`mobile-tab-item ${currentPath === '/portfolio' ? 'active' : ''}`}
        >
          <svg className="tab-icon aperture-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="14.31" y1="8" x2="20.05" y2="17.94" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9.69" y1="8" x2="21.17" y2="8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="7.38" y1="12" x2="13.12" y2="2.06" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="9.69" y1="16" x2="3.95" y2="6.06" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="14.31" y1="16" x2="2.83" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16.62" y1="12" x2="10.88" y2="21.94" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tab-label">Portfolio</span>
        </Link>

        {/* Tab 4: BLOG */}
        <Link
          to="/blog"
          className={`mobile-tab-item ${currentPath === '/blog' ? 'active' : ''}`}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tab-label">Blog</span>
        </Link>

        {/* Tab 5: CONTACT */}
        <Link
          to="/contact"
          className={`mobile-tab-item ${currentPath === '/contact' ? 'active' : ''}`}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="tab-label">Contact</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileAppTabBar;
