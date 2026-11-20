import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/siteConfigState';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const container = useRef();
  const { config } = useSiteConfig();

  const contactContent = config?.contact_page || {
    contactImg: '/common/SAS_3280.webp',
    tagline: '05 // THE INITIATION',
    heroTitleMain: 'For those who value',
    heroTitleHighlight: 'legacy over pixels.',
    pBold: 'We do not accommodate traditional wedding checklists. We do not manufacture fake poses.',
    pLight: 'We exist exclusively for couples who view their celebration as an uninhibited editorial work of art. Our visual signature is raw, cinematic, and unapologetic. We capture the high-fashion drama, the unscripted whispers, and the grand architectural scaling of your love.',
    pGold: 'If you are ready to move past standard imagery and immortalize your history as a living masterpiece, let’s begin.',
    verticalLabel: 'HIGH END EDITORIAL // RAW EMOTION',
    studioInfo: 'Bengaluru, India // Global Commissions',
    email: 'connect@shootatsightweddings.com',
    phone: '+91 9900233338',
    formTitle: 'Start a Conversation',
    formSub: 'We accept limited bookings annually to protect our artistic devotion.'
  };

  useSEO({
    title: 'Contact Shoot At Sight Weddings | Bangalore Wedding Photographers',
    description: `Check your date and send your wedding details. Call ${contactContent.phone}, WhatsApp us, or email ${contactContent.email}.`,
    ogImage: contactContent.contactImg,
  });

  const [form, setForm] = useState({
    names: '',
    email: '',
    date: '',
    venue: '',
    vision: '',
    investment: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useGSAP(() => {
    // Entrance reveal - only y movement, no opacity hide (prevents blank page)
    gsap.fromTo('.reveal-item',
      { y: 40 },
      {
        y: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.1
      }
    );

    // Image card zoom effect
    gsap.from('.contact-image-wrapper img', {
      scale: 1.15,
      duration: 2.5,
      ease: 'power3.out'
    });

  }, { scope: container });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Wedding Enquiry - ${form.names}`);
    const body = encodeURIComponent(
`New Wedding Enquiry - Shoot At Sight Weddings

Names: ${form.names}
Email: ${form.email}
Celebration Date: ${form.date}
Destinations / Venues: ${form.venue}
Investment Range: ${form.investment}

Artistic Scope / Vision:
${form.vision}`
    );
    window.location.href = `mailto:${contactContent.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div ref={container} className="contact-page-editorial-dark" data-lenis-prevent>
      <Breadcrumbs />

      <div className="contact-main-grid container">

        {/* LEFT COLUMN: THE COUTURIER PHILOSOPHY & ATTITUDE */}
        <div className="contact-editorial-left">

          <div className="reveal-item">
            <span className="contact-accent-tag">{contactContent.tagline}</span>
          </div>

          <h1 className="contact-hero-title reveal-item">
            {contactContent.heroTitleMain} <br />
            <i>{contactContent.heroTitleHighlight}</i>
          </h1>

          <div className="contact-attitude-body reveal-item">
            <p className="attitude-p-bold">
              {contactContent.pBold}
            </p>
            <p className="attitude-p-light">
              {contactContent.pLight}
            </p>
            <p className="attitude-p-gold">
              {contactContent.pGold}
            </p>
          </div>

          {/* Majestic Image Frame with offset borders */}
          <div className="contact-image-frame reveal-item">
            <div className="contact-image-vertical-label">{contactContent.verticalLabel}</div>
            <div className="contact-image-backdrop"></div>
            <div className="contact-image-wrapper">
              <img src={contactContent.contactImg} alt={contactContent.contactImgAlt || "Shoot At Sight Weddings studio"} />
            </div>
          </div>

          {/* Quick Contact Blocks */}
          <div className="contact-direct-blocks reveal-item">
            <div className="direct-item">
              <span className="direct-label">THE STUDIO</span>
              <p className="direct-value">{contactContent.studioInfo}</p>
            </div>
            <div className="direct-item">
              <span className="direct-label">DIRECT CHANNELS</span>
              <a href={`mailto:${contactContent.email}`} className="direct-link">{contactContent.email}</a>
              <a href={`tel:${contactContent.phone.replace(/[^\d+]/g, '')}`} className="direct-link">{contactContent.phone}</a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: THE COMMISSION FORM CARD */}
        <div className="contact-editorial-right reveal-item">
          <div className="contact-form-glass-card">

            <div className="form-card-header">
              <h2 className="form-card-title">{contactContent.formTitle}</h2>
              <p className="form-card-sub">{contactContent.formSub}</p>
            </div>

            <form onSubmit={handleSubmit} className="premium-contact-form">

              <div className="form-input-group">
                <label className="form-input-label">Your Names</label>
                <input
                  type="text"
                  name="names"
                  value={form.names}
                  onChange={handleChange}
                  required
                  className="input-contact-chic"
                  placeholder="e.g. Aria & Alexander"
                />
              </div>

              <div className="form-input-group">
                <label className="form-input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-contact-chic"
                  placeholder="e.g. aria@luxury.com"
                />
              </div>

              <div className="form-double-fields">
                <div className="form-input-group">
                  <label className="form-input-label">Celebration Date</label>
                  <input
                    type="text"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="input-contact-chic"
                    placeholder="DD.MM.YYYY"
                  />
                </div>
                <div className="form-input-group">
                  <label className="form-input-label">Destinations / Venues</label>
                  <input
                    type="text"
                    name="venue"
                    value={form.venue}
                    onChange={handleChange}
                    required
                    className="input-contact-chic"
                    placeholder="e.g. Lake Como, Italy"
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label className="form-input-label">Artistic Scope / Vision</label>
                <textarea
                  rows="4"
                  name="vision"
                  value={form.vision}
                  onChange={handleChange}
                  required
                  className="textarea-contact-chic"
                  placeholder="Tell us about the atmosphere, the styling, and what draws you to our raw visual signature..."
                />
              </div>

              <div className="form-input-group">
                <label className="form-input-label">Package</label>
                <select
                  name="investment"
                  value={form.investment}
                  onChange={handleChange}
                  className="select-contact-chic"
                  required
                >
                  <option value="" disabled>Select Package</option>
                  <option value="Wedding Package (₹1.7 Lakh)">Wedding Package (₹1.7 Lakh)</option>
                </select>
              </div>

              <button type="submit" className="btn-luxury-submit">
                <span>INITIATE NARRATIVE</span>
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Contact;
