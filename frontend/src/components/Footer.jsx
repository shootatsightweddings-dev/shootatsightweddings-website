import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const portfolioStrips = [
  "/4%20RAGHUDIXITH%20AND%20VARIJASHREE_WEBP/NGD_6702.webp",
  "/NAVEEN%20AND%20KATE/SYD08292.webp",
  "/NAVEEN%20AND%20KATE/SYD08467.webp",
  "/common/KRP_9777.webp",
];

const navLinks = [
  { to: "/",         label: "HOME" },
  { to: "/about",    label: "ABOUT" },
  { to: "/portfolio",label: "PORTFOLIO" },
  { to: "/films",    label: "FILMS" },
  { to: "/blog",     label: "BLOG" },
  { to: "/faq",      label: "FAQ" },
  { to: "/contact",  label: "CONTACT" },
];


const Footer = () => {
  const location = useLocation();
  const path = location.pathname;

  let themeClass;

  if (path.includes("/films")) {
    themeClass = "theme-midnight";
  } else if (path.includes("/about")) {
    themeClass = "theme-plum";
  } else if (path.includes("/blog")) {
    themeClass = "theme-olive";
  } else if (path.includes("/faq")) {
    themeClass = "theme-charcoal";
  } else if (path.includes("/contact")) {
    themeClass = "theme-velvet";
  } else if (path.includes("/shoot")) {
    themeClass = "theme-burgundy";
  } else if (path === "/") {
    themeClass = "theme-espresso";
  } else {
    // portfolio / portfolio/wedding
    themeClass = "theme-maroon";
  }

  return (
    <footer className={`ft-root ${themeClass}`}>

      {/* ── Brand Logo Header Block ── */}
      <div className="ft-brand-header">
        <div className="ft-brand-logo-wrap">
          <img
            src="/common/logo_1.webp"
            alt="Shoot At Sight Weddings"
            className="ft-main-logo"
          />
          <span className="ft-brand-weddings">WEDDINGS</span>
        </div>

        <div className="ft-brand-divider">
          <span className="ft-divider-line" />
          <span className="ft-divider-ornament">❖</span>
          <span className="ft-divider-line" />
        </div>

        <span className="ft-brand-script">
          Trigger your memories
        </span>

        <span className="ft-brand-floral">✿</span>

        <div className="ft-brand-traits">
          <span>ARTFUL</span>
          <span className="ft-trait-sep">|</span>
          <span>NATURAL</span>
          <span className="ft-trait-sep">|</span>
          <span>TIMELESS</span>
        </div>
      </div>

      {/* ── Quote ── */}
      <p className="ft-quote">
        Documenting the moments you&apos;ll cherish forever — because every glance,<br />
        every tear, every laugh deserves to live on beautifully.
      </p>

      {/* ── Horizontal nav ── */}
      <nav className="ft-nav">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className="ft-nav-link">{l.label}</Link>
        ))}
      </nav>

      {/* ── Photo strips + social ── */}
      <div className="ft-media-row">

        {/* Rotated instagram handle */}
        <span className="ft-handle">@SHOOTATSIGHTWEDDINGS</span>

        {/* 4 portrait strips */}
        <div className="ft-strips">
          {portfolioStrips.map((img, i) => (
            <div key={i} className="ft-strip">
              <img src={img} alt={`Portfolio ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div className="ft-socials">
          <a href="https://www.instagram.com/shootatsightweddings" target="_blank" rel="noreferrer" className="ft-social" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.youtube.com/@shootatsightweddings" target="_blank" rel="noreferrer" className="ft-social" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10,8.5 16,12 10,15.5" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.facebook.com/share/1DECwt75n2/" target="_blank" rel="noreferrer" className="ft-social" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://www.pinterest.com/shootatsightproductions1/" target="_blank" rel="noreferrer" className="ft-social" aria-label="Pinterest">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/shootatsightweddings" target="_blank" rel="noreferrer" className="ft-social" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://x.com/_shootatsight_" target="_blank" rel="noreferrer" className="ft-social" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>

      <nav aria-label="Services and locations" style={{display:'flex',justifyContent:'center',gap:28,marginTop:28}}>
        <Link className="ft-nav-link" to="/services">Services</Link>
        <Link className="ft-nav-link" to="/locations">Locations</Link>
      </nav>

      {/* ── Bottom tagline + copyright ── */}
      <div className="ft-bottom">
        <p className="ft-profession">Destination Wedding Photographers &amp; Cinematography Professionals</p>
        <div className="ft-bottom-line" />
        <div className="ft-copyright-row">
          <span>© {new Date().getFullYear()} Shoot At Sight Weddings</span>
          <span className="ft-dot">·</span>
          <span>Bengaluru / Global</span>
          <span className="ft-dot">·</span>
          <a href="mailto:connect@shootatsightweddings.com" className="ft-contact-link">connect@shootatsightweddings.com</a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
