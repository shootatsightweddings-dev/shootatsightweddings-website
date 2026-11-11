import { Link, useLocation } from "react-router-dom";
import "./CTABanner.css";

const CTABanner = ({ theme: overrideTheme }) => {
  const location = useLocation();
  const path = location.pathname;

  let themeClass;

  if (overrideTheme) {
    themeClass = `theme-${overrideTheme}`;
  } else if (path.includes("/films")) {
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
    <section className={`cta-banner ${themeClass}`}>

      {/* Top monogram line */}
      <div className="cta-top-mono">
        <div className="cta-line" />
        <div className="cta-monogram-ring">
          <img
            src="/common/logo_1.webp"
            alt="Shoot At Sight Weddings Logo"
            className="cta-logo-img"
          />
        </div>
        <div className="cta-line" />
      </div>

      {/* Main copy */}
      <div className="cta-copy">
        <h2 className="cta-heading">
          Ready to immortalize<br />
          your <span className="cta-script">love story?</span>
        </h2>

        <p className="cta-sub">
          Reach out to us now and let&apos;s<br />
          start planning together!
        </p>

        <Link to="/contact" className="cta-arrow" aria-label="Contact us">
          &#8594;
        </Link>
      </div>

      {/* Bottom monogram line */}
      <div className="cta-bottom-mono">
        <div className="cta-line" />
        <div className="cta-monogram-ring cta-monogram-ring--lg">
          <img
            src="/common/logo_1.webp"
            alt="Shoot At Sight Weddings Logo"
            className="cta-logo-img cta-logo-img--lg"
          />
        </div>
        <div className="cta-line" />
      </div>

    </section>
  );
};

export default CTABanner;
