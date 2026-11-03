import './FlyingDrone.css';

const whatsappUrl = "https://wa.me/919900233338?text=Hello%20Shoot%20at%20Sight%20Weddings!%20I'd%20love%20to%20start%20a%20conversation%20about%20our%20celebration.";
const instagramUrl = "https://www.instagram.com/shootatsightweddings";

const FlyingDrone = () => {
  return (
    <div className="floating-social-widget">
      {/* WhatsApp Button */}
      <a
        className="floating-social-btn whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Shoot At Sight Weddings on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="social-svg-icon" aria-hidden="true">
          <path fill="#ffffff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.24c-.25.71-1.27 1.3-1.74 1.39-.47.09-1.07.13-3.18-.73-2.7-1.11-4.43-3.86-4.56-4.04-.13-.18-1.09-1.45-1.09-2.78 0-1.33.69-1.98.94-2.24.25-.26.54-.33.72-.33h.52c.15 0 .36.01.52.39.18.42.61 1.48.66 1.59.05.11.09.24.01.39-.08.15-.12.24-.24.38-.12.14-.26.31-.37.42-.12.13-.25.27-.11.51.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.17.61-.71.77-.95.16-.24.33-.2.55-.12.23.08 1.43.68 1.68.8.25.12.42.18.48.29.06.11.06.63-.19 1.34z" />
        </svg>
      </a>

      {/* Instagram Button */}
      <a
        className="floating-social-btn instagram"
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow Shoot At Sight Weddings on Instagram"
      >
        <svg viewBox="0 0 24 24" className="social-svg-icon" aria-hidden="true">
          <path fill="#ffffff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      </a>
    </div>
  );
};

export default FlyingDrone;
