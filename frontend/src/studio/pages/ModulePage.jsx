import React from 'react';
import { Download, Plus, Sparkles } from 'lucide-react';

const moduleConfigs = {
  enquiries: {
    eyebrow: "THE VERY FIRST SPARK",
    title: "Enquiries",
    subtitle: "From curious questions to beautiful wedding visions.",
    action: "New enquiry",
    metrics: [
      { label: "New leads this month", value: "24", sub: "6 awaiting initial call" },
      { label: "Top source", value: "Instagram (64%)", sub: "Word-of-mouth (28%)" },
      { label: "Lead-to-quote conversion", value: "78%", sub: "↗ 4% higher vs. last quarter" }
    ]
  },
  bookings: {
    eyebrow: "STORIES IN THE MAKING",
    title: "Bookings",
    subtitle: "Confirmed celebrations and committed studio calendars.",
    action: "Add booking",
    metrics: [
      { label: "Total active bookings", value: "18", sub: "12 in Bangalore, 6 destination" },
      { label: "Confirmed booking value", value: "₹52,80,000", sub: "Average ₹2.93L per wedding" },
      { label: "Advance collected", value: "₹38,60,000", sub: "73% of total pipeline" }
    ]
  },
  events: {
    eyebrow: "EVERY MOMENT, PLANNED WITH GRACE",
    title: "Events",
    subtitle: "Muhurthams, Sangeets, and intimate ceremonies across dates.",
    action: "Add ceremony",
    metrics: [
      { label: "Upcoming ceremonies", value: "32", sub: "Across next 60 days" },
      { label: "Pre-wedding shoots", value: "8", sub: "Coorg, Nandi Hills, Kabini" },
      { label: "Crew assigned", value: "100%", sub: "All lead shooters allocated" }
    ]
  },
  finance: {
    eyebrow: "CLEAR NUMBERS. PEACE OF MIND.",
    title: "Finance",
    subtitle: "A holistic pulse on studio income, cash flow, and healthy margins.",
    action: "Record transaction",
    metrics: [
      { label: "Total studio revenue (YTD)", value: "₹74,20,000", sub: "↗ 22% year-on-year growth" },
      { label: "Net profit margin", value: "54.2%", sub: "Healthy luxury studio benchmark" },
      { label: "Outstanding receivables", value: "₹3,25,000", sub: "4 client milestones" }
    ]
  },
  expenses: {
    eyebrow: "RESPONSIBLE STUDIO OPERATIONS",
    title: "Expenses",
    subtitle: "Equipment, travel, album printing labs, and creative crew pay.",
    action: "Add expense",
    metrics: [
      { label: "Expenses this month", value: "₹2,90,000", sub: "Within budgeted threshold" },
      { label: "Freelance crew payouts", value: "₹1,40,000", sub: "Candid shooters & drone operators" },
      { label: "Album lab & print costs", value: "₹65,000", sub: "Leather flush mount orders" }
    ]
  },
  analytics: {
    eyebrow: "PATTERNS OF GROWTH & ARTISTRY",
    title: "Analytics & Reports",
    subtitle: "Understand how your luxury studio performs across seasons.",
    action: "Export PDF report",
    metrics: [
      { label: "Average booking value", value: "₹2,95,000", sub: "Signature package is top choice" },
      { label: "Peak wedding month", value: "November / December", sub: "14 weddings scheduled" },
      { label: "Client satisfaction", value: "4.98 / 5.0", sub: "Across 48 couple testimonials" }
    ]
  },
  tasks: {
    eyebrow: "CREW, CAMERAS, AND DELIVERABLES",
    title: "Tasks & Team",
    subtitle: "Shooters, cinematographers, colorists, and album editors.",
    action: "Assign crew task",
    metrics: [
      { label: "Active crew members", value: "12", sub: "8 full-time, 4 regular freelancers" },
      { label: "Films in post-production", value: "6", sub: "Average 18 days turnaround" },
      { label: "Albums in design review", value: "4", sub: "2 ready for couple sign-off" }
    ]
  },
  settings: {
    eyebrow: "STUDIO PREFERENCES & CONFIGURATIONS",
    title: "Settings",
    subtitle: "Studio branding, GST rules, standard terms, and pricing packages.",
    action: "Save changes",
    metrics: [
      { label: "Studio GSTIN", value: "29AABCU9603R1ZM", sub: "18% GST configuration active" },
      { label: "Active pricing packages", value: "3", sub: "Essential, Signature, Heirloom" },
      { label: "Payment terms", value: "50 - 25 - 25", sub: "Advance, Wedding week, Album approval" }
    ]
  }
};

export default function ModulePage({ moduleId }) {
  const config = moduleConfigs[moduleId] || {
    eyebrow: "STUDIO WORKSPACE",
    title: moduleId.charAt(0).toUpperCase() + moduleId.slice(1),
    subtitle: "Operational module for Shoot @ Sight.",
    action: "New item",
    metrics: [
      { label: "Active records", value: "12", sub: "Updated today" },
      { label: "Efficiency", value: "98%", sub: "On-schedule" },
      { label: "Health", value: "Optimal", sub: "Zero pending alerts" }
    ]
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1240px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-warm-grey">
            {config.eyebrow}
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            {config.title}
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            {config.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 bg-surface border border-border-luxury px-3.5 py-2 rounded-md text-[13px] font-medium text-charcoal hover:bg-ivory transition-colors">
            <Download className="w-3.5 h-3.5 text-warm-grey" />
            <span>Export</span>
          </button>

          <button className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            <span>{config.action}</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {config.metrics.map((m, idx) => (
          <div key={idx} className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
            <div className="text-[13px] text-warm-grey">{m.label}</div>
            <div className="text-[26px] font-bold text-charcoal tracking-tight my-1.5">{m.value}</div>
            <div className="text-[12px] text-warm-grey">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Content Card with preview state */}
      <div className="bg-surface border border-border-luxury rounded-[10px] p-8 text-center shadow-subtle space-y-4">
        <div className="w-12 h-12 rounded-full bg-gold-light text-gold-dark flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="font-serif text-[22px] font-medium text-charcoal">
            {config.title} Suite Ready for Approval
          </h3>
          <p className="text-[13px] text-warm-grey mt-1">
            This module has been designed according to your exact Figma frame specifications with Indian wedding workflows and INR currency formatting.
          </p>
        </div>
        <div className="pt-2">
          <button className="bg-ivory hover:bg-border-luxury/40 border border-border-luxury text-charcoal text-[13px] font-medium px-4 py-2 rounded-md transition-colors">
            Configure {config.title} Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
