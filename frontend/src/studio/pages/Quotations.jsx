import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  FileText, 
  Share2, 
  Printer, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  Trash2, 
  Eye, 
  Edit3, 
  Sparkles,
  Phone,
  Mail,
  Camera,
  Film,
  Video,
  Award,
  ShieldCheck,
  Clock,
  HardDrive
} from 'lucide-react';

const defaultProposalData = {
  id: "QT-2026-SK",
  couple: "Suhana & Kamal",
  partnerA: "Suhana",
  partnerB: "Kamal",
  tagline: "A shared story, before it becomes a lifetime…",
  location: "Vijayawada, Andhra Pradesh",
  eventDates: "11th December 2026 & March 2027",
  totalPackage: 333000,
  events: [
    {
      act: "ACT I",
      name: "The Engagement Celebration",
      date: "11th December 2026",
      venue: "Vijayawada",
      candidPhotographer: 1,
      cinematography: 1,
      traditionalVideographer: 1,
      traditionalPhotographer: 1,
      notes: "Full ceremony coverage & sunset twilight couple portraits"
    },
    {
      act: "ACT II",
      name: "Haldi at Bride's House",
      date: "March 2027",
      venue: "Bride's Residence",
      candidPhotographer: 1,
      cinematography: 1,
      traditionalVideographer: 0,
      traditionalPhotographer: 0,
      notes: "Intimate family rituals, vibrant floral moments & candid portraits"
    },
    {
      act: "ACT III",
      name: "Haldi at Groom's House",
      date: "March 2027",
      venue: "Groom's Residence",
      candidPhotographer: 1,
      cinematography: 1,
      traditionalVideographer: 0,
      traditionalPhotographer: 0,
      notes: "Candid morning celebrations & groom preparation storytelling"
    },
    {
      act: "ACT IV",
      name: "The Grand Reception",
      date: "March 2027",
      venue: "Grand Convention Center, Vijayawada",
      candidPhotographer: 1,
      cinematography: 1,
      traditionalVideographer: 1,
      traditionalPhotographer: 1,
      notes: "Stage coverage, guest greetings, couple grand entry & LED wall feed"
    },
    {
      act: "ACT V",
      name: "The Wedding (Muhurtham)",
      date: "March 2027",
      venue: "Royal Kalyana Mandapam, Vijayawada",
      candidPhotographer: 1,
      cinematography: 1,
      traditionalVideographer: 1,
      traditionalPhotographer: 1,
      notes: "Traditional rituals, mangalsutra ceremony, drone aerials & family portraits"
    }
  ],
  teamCount: [
    { role: "Lead Candid Photographer", count: 1, desc: "Editorial couple & emotional moments" },
    { role: "Director of Cinematography", count: 1, desc: "4K cinematic film & gimbal motion" },
    { role: "Traditional Photographer", count: 1, desc: "Stage coverage & family group archives" },
    { role: "Traditional Videographer", count: 1, desc: "Complete event documentation" },
    { role: "Production Assistant", count: 1, desc: "Lighting setups & backup storage sync" },
    { role: "Show Director", count: 1, desc: "On-ground ceremony coordination" }
  ],
  deliverables: [
    {
      title: "Immediate Sneak-Peek Gallery",
      time: "5–6 Working Days",
      desc: "Best 150 high-res color-corrected editorial images, ready to share with family & social media."
    },
    {
      title: "Master High-Resolution Image Archive",
      time: "40–60 Working Days",
      desc: "Complete curated set of 800–1,200 color-graded photos in full print resolution."
    },
    {
      title: "Cinematic Highlight Movie",
      time: "60–70 Working Days",
      desc: "A stylized 2–6 minute 4K cinematic film capturing the raw emotion, laughter, and essence."
    },
    {
      title: "Feature-Length Documentary Film",
      time: "Within 100 Working Days",
      desc: "Exclusive 30–45 minute cinematic narrative including sacred vows, speeches, and ceremonies."
    },
    {
      title: "Bespoke Handcrafted Wedding Album",
      time: "Included in Package",
      desc: "1 standardized luxury flush-mount album with lay-flat archival paper and custom cover."
    },
    {
      title: "Drone Aerial Cinematography",
      time: "All Major Events",
      desc: "Stunning 4K bird's-eye footage of grand venues, entries, and baraat processions."
    },
    {
      title: "Complimentary Cinematic Reels",
      time: "Each Event",
      desc: "Creative vertical 9:16 reels optimized for Instagram & WhatsApp sharing."
    },
    {
      title: "LED Wall Feed Provision",
      time: "Live Coverage",
      desc: "Seamless live camera switching provision for stage backdrop screens."
    }
  ],
  ssdRequirement: "Client to provide a 2/4 TB High-Speed SSD to the team during wedding coverage for raw archive backup.",
  studioContacts: {
    phones: "9900233338 / 9148371084",
    email: "shootatsightwedding@gmail.com",
    address: "Bengaluru, Karnataka, India",
    website: "shootatsightweddings.com"
  }
};

export default function Quotations() {
  const [proposal, setProposal] = useState(defaultProposalData);
  const [activeView, setActiveView] = useState('preview'); // 'preview' or 'edit'

  const advanceAmount = Math.round(proposal.totalPackage * 0.3);
  const eventDayAmount = Math.round(proposal.totalPackage * 0.6);
  const finalAmount = Math.round(proposal.totalPackage * 0.1);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const handleShareWhatsApp = () => {
    const text = `✨ *SHOOT @ SIGHT WEDDINGS — OFFICIAL PROPOSAL* ✨\n\nDear *${proposal.couple}*,\n\nWe are delighted to present your bespoke wedding photography & cinematography proposal for *${proposal.location}*.\n\n💍 *Total Investment*: ${formatINR(proposal.totalPackage)}\n\n📅 *Payment Architecture*:\n• *30% Booking Retainer*: ${formatINR(advanceAmount)}\n• *60% On Event Day*: ${formatINR(eventDayAmount)}\n• *10% Final Asset Handover*: ${formatINR(finalAmount)}\n\n✨ *Events Covered*: 5 Ceremonies (${proposal.eventDates})\n🎥 *Deliverables*: 150 Previews (5-6 Days), Full Master Gallery, 4K Teaser Film, 30-45 Min Feature Film, 1 Luxury Album & Drone Coverage.\n\n"A shared story, before it becomes a lifetime…"\n\nWarm Regards,\n*Pavithra · Creative Director*\nShoot @ Sight Weddings\n📞 9900233338 / 9148371084\n🌐 shootatsightweddings.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 max-w-[1240px]">
      {/* 1. Top Control Bar (Hidden on print) */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold-dark flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>BESPOKE CLIENT PROPOSAL SYSTEM</span>
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            Quotation Suite
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            Luxury editorial proposal template featuring official Shoot @ Sight branding, watermarks, and verification seals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <div className="bg-surface border border-border-luxury p-1 rounded-lg flex items-center space-x-1 shadow-xs">
            <button
              onClick={() => setActiveView('preview')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                activeView === 'preview' 
                  ? 'bg-charcoal text-white font-semibold shadow-xs' 
                  : 'text-warm-grey hover:text-charcoal'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>Editorial Preview</span>
            </button>
            <button
              onClick={() => setActiveView('edit')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                activeView === 'edit' 
                  ? 'bg-charcoal text-white font-semibold shadow-xs' 
                  : 'text-warm-grey hover:text-charcoal'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-gold" />
              <span>Edit Details</span>
            </button>
          </div>

          <button 
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Share on WhatsApp</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white text-[13px] font-semibold px-4 py-2 rounded-md transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Package Stats (Hidden on print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface border border-border-luxury rounded-[10px] p-4 shadow-subtle">
          <div className="text-[11px] text-warm-grey uppercase tracking-wider font-semibold">Couple</div>
          <div className="text-[17px] font-bold text-charcoal font-serif mt-1 truncate">
            {proposal.couple}
          </div>
          <div className="text-[11px] text-warm-grey mt-0.5">{proposal.location}</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-4 shadow-subtle">
          <div className="text-[11px] text-warm-grey uppercase tracking-wider font-semibold">Total Package</div>
          <div className="text-[20px] font-bold text-gold-dark mt-1">
            {formatINR(proposal.totalPackage)}
          </div>
          <div className="text-[11px] text-sage font-medium">5 Ceremonies Included</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-4 shadow-subtle">
          <div className="text-[11px] text-warm-grey uppercase tracking-wider font-semibold">30% Booking Retainer</div>
          <div className="text-[20px] font-bold text-charcoal mt-1">
            {formatINR(advanceAmount)}
          </div>
          <div className="text-[11px] text-warm-grey">Calendar Date Lock</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-4 shadow-subtle">
          <div className="text-[11px] text-warm-grey uppercase tracking-wider font-semibold">60% Event Day Milestone</div>
          <div className="text-[20px] font-bold text-charcoal mt-1">
            {formatINR(eventDayAmount)}
          </div>
          <div className="text-[11px] text-warm-grey">Remaining 10% on RAW delivery</div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      {activeView === 'edit' ? (
        /* ================= EDIT PANEL ================= */
        <div className="bg-surface border border-border-luxury rounded-[12px] p-7 shadow-subtle space-y-6">
          <div className="border-b border-border-luxury pb-3">
            <h2 className="font-serif text-[24px] font-medium text-charcoal">
              Proposal Customizer
            </h2>
            <p className="text-[13px] text-warm-grey">
              Configure wedding project details, customize investment numbers, and add ceremony schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1">
                Couple Names
              </label>
              <input 
                type="text" 
                value={proposal.couple} 
                onChange={(e) => setProposal({ ...proposal, couple: e.target.value })}
                className="w-full bg-ivory border border-border-luxury rounded-lg px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1">
                Destination / Location
              </label>
              <input 
                type="text" 
                value={proposal.location} 
                onChange={(e) => setProposal({ ...proposal, location: e.target.value })}
                className="w-full bg-ivory border border-border-luxury rounded-lg px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1">
                Event Dates
              </label>
              <input 
                type="text" 
                value={proposal.eventDates} 
                onChange={(e) => setProposal({ ...proposal, eventDates: e.target.value })}
                className="w-full bg-ivory border border-border-luxury rounded-lg px-3.5 py-2 text-[13px] text-charcoal focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1">
                Total Package Investment (₹ INR)
              </label>
              <input 
                type="number" 
                value={proposal.totalPackage} 
                onChange={(e) => setProposal({ ...proposal, totalPackage: Number(e.target.value) })}
                className="w-full bg-ivory border border-border-luxury rounded-lg px-3.5 py-2 text-[16px] font-bold text-gold-dark focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1">
                Editorial Tagline
              </label>
              <input 
                type="text" 
                value={proposal.tagline} 
                onChange={(e) => setProposal({ ...proposal, tagline: e.target.value })}
                className="w-full bg-ivory border border-border-luxury rounded-lg px-3.5 py-2 text-[13px] text-charcoal italic font-serif focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border-luxury">
            <button
              onClick={() => setActiveView('preview')}
              className="bg-charcoal hover:bg-black text-white text-[13px] font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              Update & Open Editorial Preview
            </button>
          </div>
        </div>
      ) : (
        /* ================= HIGH-FASHION EDITORIAL PROPOSAL PREVIEW ================= */
        <div className="space-y-16 max-w-[880px] mx-auto print:max-w-none">

          {/* ========================================================
              PAGE 1: HAUTE COUTURE COVER PAGE
              Features: Double hairline gold border, corner filigrees,
              oversized brand watermark, luxury seal, and typography.
              ======================================================== */}
          <div className="proposal-page relative bg-[#FAF8F5] border-[1.5px] border-[#C5A46D]/60 rounded-xl p-10 md:p-16 min-h-[960px] flex flex-col justify-between shadow-2xl overflow-hidden text-center">
            
            {/* Corner Decorative Filigrees / Brackets */}
            <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#C5A46D] pointer-events-none"></div>
            <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#C5A46D] pointer-events-none"></div>
            <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#C5A46D] pointer-events-none"></div>
            <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#C5A46D] pointer-events-none"></div>

            {/* Subtle Inner Hairline Frame */}
            <div className="absolute inset-7 border border-[#C5A46D]/20 pointer-events-none"></div>

            {/* OFFICIAL BRAND WATERMARK (Faint official logo behind content) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.045]">
              <img 
                src="/shootatsight_logo.webp" 
                alt="watermark" 
                className="w-[520px] max-w-none h-auto object-contain filter grayscale" 
              />
            </div>

            {/* Top Brand Header */}
            <div className="relative z-10 pt-4">
              <div className="flex flex-col items-center">
                {/* Official Logo Display */}
                <img 
                  src="/shootatsight_logo.webp" 
                  alt="Shoot @ Sight Weddings" 
                  className="h-28 md:h-36 w-auto object-contain mx-auto drop-shadow-xs" 
                />

                <div className="w-16 h-[1.5px] bg-[#C5A46D] my-3"></div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#85817B] font-medium">
                  CINEMATOGRAPHY • EDITORIAL PHOTOGRAPHY • HEIRLOOMS
                </div>
              </div>
            </div>

            {/* Hero Couple Centerpiece */}
            <div className="relative z-10 my-auto py-12 space-y-6">
              <div className="inline-flex items-center space-x-2 text-[11px] tracking-[0.25em] uppercase text-[#C5A46D] font-semibold bg-white/70 px-4 py-1.5 rounded-full border border-[#C5A46D]/30 shadow-xs">
                <span>COMMISSIONED WEDDING CELEBRATION</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-[56px] md:text-[76px] font-normal text-[#5C1D24] leading-none tracking-wide">
                  {proposal.couple.split('&')[0]}
                </h2>
                <div className="font-serif italic text-[36px] text-[#C5A46D] leading-none">
                  &
                </div>
                <h2 className="font-serif text-[56px] md:text-[76px] font-normal text-[#5C1D24] leading-none tracking-wide">
                  {proposal.couple.split('&')[1] || 'Kamal'}
                </h2>
              </div>

              <div className="max-w-md mx-auto pt-4">
                <p className="font-serif italic text-[20px] text-[#282828]/80 leading-relaxed">
                  "{proposal.tagline}"
                </p>
              </div>
            </div>

            {/* Bottom Meta & Studio Seal */}
            <div className="relative z-10 border-t border-[#C5A46D]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-left gap-4">
              <div className="space-y-1">
                <div className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#85817B]">
                  LOCATION: <span className="text-[#282828] font-bold">{proposal.location}</span>
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#85817B]">
                  EVENT TIMELINE: <span className="text-[#282828] font-bold">{proposal.eventDates}</span>
                </div>
              </div>

              {/* Verified Studio Emblem Badge */}
              <div className="flex items-center space-x-2.5 bg-white/80 border border-[#C5A46D]/40 px-3.5 py-1.5 rounded-full shadow-xs">
                <Award className="w-4 h-4 text-[#C5A46D]" />
                <span className="text-[10px] tracking-[0.15em] font-bold text-[#282828] uppercase">
                  OFFICIAL STUDIO PROPOSAL · 2026/27
                </span>
              </div>
            </div>
          </div>


          {/* ========================================================
              PAGE 2: CEREMONIES & EVENT COVERAGE (THE FIVE ACTS)
              Features: Act-by-act luxury cards, crew badges, and watermark.
              ======================================================== */}
          <div className="proposal-page relative bg-[#FAF8F5] border-[1.5px] border-[#C5A46D]/60 rounded-xl p-10 md:p-14 min-h-[960px] shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035]">
              <img 
                src="/shootatsight_logo.webp" 
                alt="watermark" 
                className="w-[480px] max-w-none h-auto object-contain filter grayscale" 
              />
            </div>

            <div>
              {/* Page Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#C5A46D]/40 relative z-10">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#C5A46D] font-bold">
                    SECTION 01 · CEREMONY COVERAGE
                  </div>
                  <h2 className="font-serif text-[32px] font-bold text-[#5C1D24]">
                    The Wedding Itinerary & Acts
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <img 
                    src="/shootatsight_logo.webp" 
                    alt="Shoot @ Sight Weddings" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
              </div>

              {/* Ceremony Acts Cards */}
              <div className="mt-8 space-y-4">
                {proposal.events.map((ev, index) => (
                  <div 
                    key={index}
                    className="relative bg-white/90 border border-[#C5A46D]/30 rounded-lg p-5 shadow-subtle hover:border-[#C5A46D] transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border-luxury/60 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-[#C5A46D] bg-[#F7F2E9] px-2 py-0.5 rounded border border-[#C5A46D]/30">
                            {ev.act}
                          </span>
                          <span className="text-[12px] text-warm-grey font-medium">
                            {ev.date} · {ev.venue}
                          </span>
                        </div>
                        <h3 className="font-serif text-[21px] font-bold text-[#282828] mt-1">
                          {ev.name}
                        </h3>
                      </div>

                      {/* Pill tags for crew */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        {ev.candidPhotographer > 0 && (
                          <span className="bg-[#FAF8F5] text-charcoal border border-[#C5A46D]/30 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                            <Camera className="w-3 h-3 text-[#C5A46D]" />
                            <span>Candid (1)</span>
                          </span>
                        )}
                        {ev.cinematography > 0 && (
                          <span className="bg-[#FAF8F5] text-charcoal border border-[#C5A46D]/30 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                            <Film className="w-3 h-3 text-[#C5A46D]" />
                            <span>Cinema (1)</span>
                          </span>
                        )}
                        {ev.traditionalVideographer > 0 && (
                          <span className="bg-[#FAF8F5] text-charcoal border border-border-luxury px-2 py-0.5 rounded font-medium">
                            Trad Video (1)
                          </span>
                        )}
                        {ev.traditionalPhotographer > 0 && (
                          <span className="bg-[#FAF8F5] text-charcoal border border-border-luxury px-2 py-0.5 rounded font-medium">
                            Trad Photo (1)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[12px] text-warm-grey italic pt-2 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                      <span>{ev.notes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-[#C5A46D]/30 flex items-center justify-between text-[11px] text-warm-grey">
              <span>5 Custom Ceremonial Acts</span>
              <span className="font-mono">Page 02 / 05</span>
            </div>
          </div>


          {/* ========================================================
              PAGE 3: TEAM ALLOCATION & TOTAL INVESTMENT
              Features: Creative crew registry + Illuminated Gold Rate Card.
              ======================================================== */}
          <div className="proposal-page relative bg-[#FAF8F5] border-[1.5px] border-[#C5A46D]/60 rounded-xl p-10 md:p-14 min-h-[960px] shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035]">
              <img 
                src="/shootatsight_logo.webp" 
                alt="watermark" 
                className="w-[480px] max-w-none h-auto object-contain filter grayscale" 
              />
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#C5A46D]/40 relative z-10">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#C5A46D] font-bold">
                    SECTION 02 · ON-GROUND DEPLOYMENT
                  </div>
                  <h2 className="font-serif text-[32px] font-bold text-[#5C1D24]">
                    Creative Team & Investment
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <img 
                    src="/shootatsight_logo.webp" 
                    alt="Shoot @ Sight Weddings" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
              </div>

              {/* Team Table (Elevated Layout) */}
              <div className="mt-8 bg-white border border-[#C5A46D]/40 rounded-xl overflow-hidden shadow-subtle">
                <div className="grid grid-cols-12 bg-[#F7F2E9]/70 border-b border-[#C5A46D]/30 py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-charcoal">
                  <div className="col-span-8">CREW ROLE & ARTISTIC SPECIALIZATION</div>
                  <div className="col-span-4 text-right">ON-GROUND COUNT</div>
                </div>

                <div className="divide-y divide-border-luxury/60">
                  {proposal.teamCount.map((member, i) => (
                    <div key={i} className="grid grid-cols-12 py-3.5 px-6 items-center text-[13px] hover:bg-[#FAF8F5] transition-colors">
                      <div className="col-span-8">
                        <div className="font-semibold text-charcoal">{member.role}</div>
                        <div className="text-[11px] text-warm-grey">{member.desc}</div>
                      </div>
                      <div className="col-span-4 text-right font-bold text-charcoal font-mono">
                        0{member.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ILLUMINATED GOLD INVESTMENT CARD */}
              <div className="mt-8 relative rounded-xl p-8 bg-gradient-to-br from-white via-[#FAF8F5] to-[#F7F2E9] border-2 border-[#C5A46D] shadow-luxury text-center overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#C5A46D]/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A46D] mb-2">
                  <Award className="w-4 h-4" />
                  <span>TOTAL COMPREHENSIVE INVESTMENT</span>
                </div>

                <div className="font-serif text-[48px] md:text-[56px] font-bold text-[#5C1D24] leading-tight tracking-tight">
                  Rs. {proposal.totalPackage.toLocaleString('en-IN')}/-
                </div>

                <div className="text-[13px] text-charcoal font-medium mt-1">
                  Covers all 5 ceremonies, pre-wedding consultations, complete editing & bespoke album creation.
                </div>
                <div className="text-[11px] text-warm-grey mt-1">
                  (Inclusive of drone coverage, high-speed cloud gallery, and teaser cuts)
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-[#C5A46D]/30 flex items-center justify-between text-[11px] text-warm-grey">
              <span>Comprehensive 6-Crew Dedicated Production</span>
              <span className="font-mono">Page 03 / 05</span>
            </div>
          </div>


          {/* ========================================================
              PAGE 4: DELIVERABLES & CREATIVE TIMELINES
              Features: Visual roadmap with exact delivery turnaround times.
              ======================================================== */}
          <div className="proposal-page relative bg-[#FAF8F5] border-[1.5px] border-[#C5A46D]/60 rounded-xl p-10 md:p-14 min-h-[960px] shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035]">
              <img 
                src="/shootatsight_logo.webp" 
                alt="watermark" 
                className="w-[480px] max-w-none h-auto object-contain filter grayscale" 
              />
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#C5A46D]/40 relative z-10">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#C5A46D] font-bold">
                    SECTION 03 · POST-PRODUCTION & ARTIFACTS
                  </div>
                  <h2 className="font-serif text-[32px] font-bold text-[#5C1D24]">
                    Curated Deliverables
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <img 
                    src="/shootatsight_logo.webp" 
                    alt="Shoot @ Sight Weddings" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
              </div>

              {/* Deliverables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {proposal.deliverables.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#C5A46D]/30 rounded-lg p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-serif text-[17px] font-bold text-charcoal">
                        {item.title}
                      </div>
                      <span className="text-[10px] font-bold font-mono text-[#5C1D24] bg-[#FDF1F0] px-2 py-0.5 rounded border border-[#5C1D24]/20">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[12px] text-warm-grey leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hardware / SSD Requirement Banner */}
              <div className="mt-6 p-4 rounded-lg bg-white border-l-4 border-[#C5A46D] shadow-xs flex items-center space-x-3 text-[13px] text-charcoal">
                <HardDrive className="w-5 h-5 text-[#C5A46D] shrink-0" />
                <div>
                  <span className="font-bold text-[#5C1D24]">SSD Hardware Provision:</span> {proposal.ssdRequirement}
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-[#C5A46D]/30 flex items-center justify-between text-[11px] text-warm-grey">
              <span>Archival Quality & Color-Grading Guarantee</span>
              <span className="font-mono">Page 04 / 05</span>
            </div>
          </div>


          {/* ========================================================
              PAGE 5: PAYMENT ARCHITECTURE & STUDIO VERIFICATION
              Features: 30% / 60% / 10% milestone breakdown +
              Shoot @ Sight gold stamp seal + contact channels.
              ======================================================== */}
          <div className="proposal-page relative bg-[#FAF8F5] border-[1.5px] border-[#C5A46D]/60 rounded-xl p-10 md:p-14 min-h-[960px] shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035]">
              <img 
                src="/shootatsight_logo.webp" 
                alt="watermark" 
                className="w-[480px] max-w-none h-auto object-contain filter grayscale" 
              />
            </div>

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#C5A46D]/40 relative z-10">
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-[#C5A46D] font-bold">
                    SECTION 04 · MILESTONES & TERMS
                  </div>
                  <h2 className="font-serif text-[32px] font-bold text-[#5C1D24]">
                    Payment Architecture & Terms
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <img 
                    src="/shootatsight_logo.webp" 
                    alt="Shoot @ Sight Weddings" 
                    className="h-10 w-auto object-contain" 
                  />
                </div>
              </div>

              {/* The 30 / 60 / 10 Milestone Structure */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Milestone 1: 30% */}
                <div className="bg-white border-2 border-[#C5A46D]/40 rounded-xl p-6 shadow-subtle text-center relative overflow-hidden">
                  <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A46D] mb-1">
                    MILESTONE 01 · 30%
                  </div>
                  <div className="text-[28px] font-bold text-[#5C1D24] font-serif my-1">
                    {formatINR(advanceAmount)}
                  </div>
                  <div className="text-[12px] font-semibold text-charcoal uppercase mt-2">
                    AT THE TIME OF BOOKING
                  </div>
                  <p className="text-[11px] text-warm-grey mt-1">
                    Locks your wedding dates exclusively on our studio calendar.
                  </p>
                </div>

                {/* Milestone 2: 60% */}
                <div className="bg-white border-2 border-[#C5A46D] rounded-xl p-6 shadow-subtle text-center relative overflow-hidden bg-gradient-to-b from-white to-[#F7F2E9]/40">
                  <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A46D] mb-1">
                    MILESTONE 02 · 60%
                  </div>
                  <div className="text-[28px] font-bold text-[#5C1D24] font-serif my-1">
                    {formatINR(eventDayAmount)}
                  </div>
                  <div className="text-[12px] font-semibold text-charcoal uppercase mt-2">
                    ON EVENT DAY
                  </div>
                  <p className="text-[11px] text-warm-grey mt-1">
                    Due prior to coverage of the main ceremony & reception.
                  </p>
                </div>

                {/* Milestone 3: 10% */}
                <div className="bg-white border-2 border-[#C5A46D]/40 rounded-xl p-6 shadow-subtle text-center relative overflow-hidden">
                  <div className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A46D] mb-1">
                    MILESTONE 03 · 10%
                  </div>
                  <div className="text-[28px] font-bold text-[#5C1D24] font-serif my-1">
                    {formatINR(finalAmount)}
                  </div>
                  <div className="text-[12px] font-semibold text-charcoal uppercase mt-2">
                    BEFORE RECEIVING RAW IMAGES
                  </div>
                  <p className="text-[11px] text-warm-grey mt-1">
                    Final handover of complete high-res raw images & SSD archive.
                  </p>
                </div>
              </div>

              {/* Standard Terms Summary */}
              <div className="mt-8 bg-white border border-[#C5A46D]/30 rounded-xl p-6 shadow-xs space-y-3">
                <div className="text-[12px] font-bold uppercase tracking-wider text-[#5C1D24] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                  <span>Important Commercial & Operational Terms</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-charcoal/80 leading-relaxed">
                  <div>• <span className="font-semibold text-charcoal">Session Timings:</span> Standard sessions run 7–8 hours per shift; additional overtime is billed separately.</div>
                  <div>• <span className="font-semibold text-charcoal">Data Retention:</span> Project files archived for 6 months after event dates; SSD backup recommended.</div>
                  <div>• <span className="font-semibold text-charcoal">Logistics & Stay:</span> Client provides 2–3 accommodation rooms, meals, and transit for the team.</div>
                  <div>• <span className="font-semibold text-charcoal">Artistic Freedom:</span> Grading and pacing reflect Shoot @ Sight’s authentic creative standard.</div>
                </div>
              </div>

              {/* Official Seal & Signature Section */}
              <div className="mt-8 pt-6 border-t border-[#C5A46D]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Official Studio Seal */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-16 h-16 rounded-full border-2 border-[#C5A46D] flex flex-col items-center justify-center text-center p-1 bg-white shadow-xs">
                    <span className="text-[7px] tracking-widest font-bold text-[#C5A46D] uppercase">SHOOT @ SIGHT</span>
                    <Award className="w-4 h-4 text-[#5C1D24] my-0.5" />
                    <span className="text-[6px] tracking-widest text-warm-grey uppercase">VERIFIED</span>
                  </div>
                  <div>
                    <div className="font-serif text-[16px] font-bold text-charcoal">
                      Pavithra
                    </div>
                    <div className="text-[11px] text-warm-grey">
                      Founder & Creative Director · Shoot @ Sight
                    </div>
                  </div>
                </div>

                {/* Studio Helpline Channels */}
                <div className="text-right text-[12px] text-charcoal space-y-1">
                  <div className="flex items-center justify-end space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#5C1D24]" />
                    <span className="font-medium">{proposal.studioContacts.phones}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#5C1D24]" />
                    <span className="font-medium">{proposal.studioContacts.email}</span>
                  </div>
                  <div className="text-[11px] text-warm-grey">
                    {proposal.studioContacts.address} · {proposal.studioContacts.website}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-[#C5A46D]/30 flex items-center justify-between text-[11px] text-warm-grey">
              <span>Shoot At Sight Weddings · Bespoke Proposal Acceptance</span>
              <span className="font-mono">Page 05 / 05</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
