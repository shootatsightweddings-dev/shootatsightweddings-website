import { useState } from "react";
import { useSiteConfig } from "../context/siteConfigState";
import useSEO from "../hooks/useSEO";
import Breadcrumbs from "../components/Breadcrumbs";
import "./FAQ.css";

const defaultFaqs = [
  {
    category: "BOOKINGS & AVAILABILITY",
    items: [
      {
        q: "How far in advance should we book you?",
        a: "We recommend booking at least 9–12 months in advance for peak wedding season (October–February). For off-season dates, 6 months is usually sufficient. Popular dates fill up quickly, so the sooner you reach out, the better!"
      },
      {
        q: "Do you travel for destination weddings?",
        a: "Absolutely. We love destination weddings and have shot across India and internationally. Travel and accommodation costs are billed separately based on the location. Just tell us where your celebration is happening and we will plan accordingly."
      },
      {
        q: "How do we confirm our booking?",
        a: "A booking is confirmed with a signed contract and an initial payment of 30% of the total package. The remaining balance follows in two parts: 60% on the event day, and the final 10% before the raw images are delivered."
      },
    ],
  },
  {
    category: "PHOTOGRAPHY & FILMS",
    items: [
      {
        q: "How many photographers will be present on the wedding day?",
        a: "Our standard packages include a lead photographer and a second shooter to ensure every angle and candid moment is covered — from the bridal prep to the reception. For larger events, additional photographers can be arranged."
      },
      {
        q: "What style of photography do you specialise in?",
        a: "We shoot in a high-end editorial, documentary style — raw, cinematic, and emotive. We focus on unscripted moments, architectural light, and the quiet emotions that define your story. You can explore our portfolio to get a feel for our signature aesthetic."
      },
      {
        q: "Do you also offer wedding films?",
        a: "Yes! We offer cinematic wedding films ranging from short highlight reels (3–5 minutes) to full-length documentary films. Films can be added to any photography package or booked as a standalone service."
      },
      {
        q: "Can we request specific shots or poses?",
        a: "Of course! We encourage you to share a mood board or inspiration images before the wedding. While we work best with natural, unposed moments, we always ensure your must-have portraits and family formals are captured perfectly."
      },
    ],
  },
  {
    category: "DELIVERY & EDITING",
    items: [
      {
        q: "How long does it take to receive our photos and films?",
        a: "Edited photographs are delivered within 6–8 weeks of your wedding date. Wedding highlight films take 8–12 weeks. Full-length documentary films may take up to 16 weeks due to the depth of editing involved."
      },
      {
        q: "How will our photos and videos be delivered?",
        a: "All images are delivered via a private online gallery where you can download full-resolution files, share with family and friends, and order prints directly. Videos are shared via a private streaming link."
      },
      {
        q: "What editing style do you apply to photos?",
        a: "We apply a refined, timeless edit — true-to-life skin tones, balanced contrast, and cinematic warmth. We do not apply heavy presets or filters that could look dated in years to come. Our goal is photos you'll cherish forever."
      },
    ],
  },
  {
    category: "PRICING & PACKAGES",
    items: [
      {
        q: "What are your packages and pricing?",
        a: "Wedding photography and film packages start at ₹1.7 lakh, tailored to the scale and vision of your celebration. Please visit our Contact page or reach out via WhatsApp to receive a customised quote based on your wedding details."
      },
      {
        q: "Do you offer engagement or pre-wedding shoots?",
        a: "Yes! Pre-wedding shoots are one of our favourite sessions — it gives us a chance to understand how you move together and helps you feel comfortable in front of our cameras before the big day. Pre-wedding sessions are available as add-ons or as standalone bookings."
      },
      {
        q: "Is a second shooter included in all packages?",
        a: "Most of our packages include a second photographer. For intimate or elopement-style weddings, a single photographer may be sufficient. We will advise based on your wedding timeline and guest count."
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <h3 className="faq-question-heading">
        <button className="faq-question" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span>{q}</span>
          <span className="faq-icon">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div className="faq-answer-wrapper" style={{ maxHeight: open ? "400px" : "0px" }}>
        <p className="faq-answer">{a}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { config } = useSiteConfig();

  const faqContent = config?.faq_page || {
    eyebrow: 'HAVE QUESTIONS?',
    titleMain: 'Frequently Asked',
    titleHighlight: 'Questions',
    subtitle: 'Everything you need to know before we begin your story.',
    ctaText: 'Still have questions? We would love to hear from you.',
    ctaBtnText: 'Start a Conversation',
    faqs: defaultFaqs
  };

  const activeFaqs = faqContent.faqs && faqContent.faqs.length > 0 ? faqContent.faqs : defaultFaqs;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqs.flatMap((category) =>
      (category.items || []).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
    ),
  };

  useSEO({
    title: "Wedding Photography FAQ | Booking, Pricing & Delivery | Shoot At Sight",
    description: "How far ahead to book, how many photographers attend, and when your photos and film are delivered.",
    jsonLd: [faqJsonLd],
  });

  return (
    <div className="faq-page">
      <Breadcrumbs />
      {/* Page Header */}
      <div className="faq-page-header">
        <span className="faq-eyebrow">{faqContent.eyebrow}</span>
        <h1 className="faq-title">
          {faqContent.titleMain} <i>{faqContent.titleHighlight}</i>
        </h1>
        <p className="faq-subtitle">{faqContent.subtitle}</p>
      </div>

      {/* FAQ Sections */}
      <div className="faq-content">
        {activeFaqs.map((section) => (
          <div key={section.category} className="faq-section">
            <h2 className="faq-section-title">{section.category}</h2>
            <div className="faq-list">
              {section.items && section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Strip */}
      <div className="faq-cta-strip">
        <p className="faq-cta-text">{faqContent.ctaText}</p>
        <a href="/contact" className="faq-cta-btn">{faqContent.ctaBtnText}</a>
      </div>
    </div>
  );
};

export default FAQ;
