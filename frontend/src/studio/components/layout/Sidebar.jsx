import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  FileText, 
  Bookmark, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  Receipt, 
  CreditCard, 
  TrendingUp, 
  CheckSquare, 
  Settings,
  HelpCircle,
  ChevronDown,
  Globe,
  Camera,
  PenTool,
  MessageSquare,
  FileCode,
  LogOut
} from 'lucide-react';
import { studioOwner } from '../../data/mockData';

const navSections = [
  {
    title: "WORKSPACE",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "clients", label: "Clients", icon: Users },
      { id: "enquiries", label: "Enquiries", icon: Mail, badge: "06" },
      { id: "quotations", label: "Quotations", icon: FileText },
      { id: "bookings", label: "Bookings", icon: Bookmark },
      { id: "events", label: "Events", icon: Sparkles },
      { id: "calendar", label: "Calendar", icon: Calendar },
    ]
  },
  {
    title: "BUSINESS",
    items: [
      { id: "finance", label: "Finance", icon: IndianRupee },
      { id: "invoices", label: "Invoices", icon: Receipt },
      { id: "expenses", label: "Expenses", icon: CreditCard },
      { id: "analytics", label: "Analytics", icon: TrendingUp },
    ]
  },
  {
    title: "WEBSITE CMS",
    items: [
      { id: "cms-site-editor", label: "Live Page Editor", icon: Globe },
      { id: "cms-shoots", label: "Stories & Galleries", icon: Camera },
      { id: "cms-blogs", label: "Journal Articles", icon: PenTool },
      { id: "cms-testimonials", label: "Testimonials", icon: MessageSquare },
      { id: "cms-content-pages", label: "Content & SEO", icon: FileCode },
    ]
  },
  {
    title: "STUDIO",
    items: [
      { id: "tasks", label: "Tasks & Team", icon: CheckSquare },
      { id: "settings", label: "Settings", icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, onSelectTab, onLogout }) {
  return (
    <aside className="w-[224px] min-w-[224px] h-screen bg-surface border-r border-border-luxury flex flex-col justify-between select-none fixed left-0 top-0 z-30 overflow-y-auto no-print">
      <div>
        {/* Brand Header */}
        <div className="pt-5 pb-3 px-4 text-center border-b border-border-luxury/60">
          <div className="flex flex-col items-center">
            {/* Official Logo */}
            <img 
              src="/shootatsight_logo.webp" 
              alt="Shoot @ Sight Weddings" 
              className="h-11 w-auto object-contain mx-auto" 
            />
            <div className="text-[9px] tracking-[0.25em] uppercase font-sans font-semibold text-gold mt-1">
              STUDIO OS &bull; ADMIN
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1 text-[10px] font-semibold tracking-wider text-warm-grey/70 uppercase">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                        isActive
                          ? "bg-gold-light text-charcoal font-semibold shadow-xs"
                          : "text-warm-grey hover:text-charcoal hover:bg-ivory"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-gold-dark" : "text-warm-grey"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isActive 
                            ? "bg-gold text-white" 
                            : "bg-border-luxury text-warm-grey"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area: Help & Profile */}
      <div className="p-3 border-t border-border-luxury/70 space-y-2 bg-surface">
        {/* Studio Help Card */}
        <div className="p-2.5 rounded-lg bg-ivory border border-border-luxury text-left">
          <div className="flex items-center space-x-2 text-charcoal font-medium text-[11.5px]">
            <HelpCircle className="w-3.5 h-3.5 text-gold" />
            <span>Shoot @ Sight Studio</span>
          </div>
          <p className="text-[10.5px] text-warm-grey mt-0.5">Luxury Photography OS</p>
          <a href="/" target="_blank" rel="noreferrer" className="inline-block mt-1 text-[11px] font-medium text-gold hover:underline">
            View Live Site ↗
          </a>
        </div>

        {/* Owner Profile with Sign Out */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-ivory/50 border border-border-luxury/60">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-gold/20 text-gold-dark font-serif font-bold text-xs flex items-center justify-center border border-gold/30">
              P
            </div>
            <div className="text-left">
              <div className="text-[11.5px] font-semibold text-charcoal leading-tight">{studioOwner.name}</div>
              <div className="text-[9.5px] text-warm-grey">Owner</div>
            </div>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout} 
              title="Sign Out"
              className="p-1 hover:text-coral text-warm-grey transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
