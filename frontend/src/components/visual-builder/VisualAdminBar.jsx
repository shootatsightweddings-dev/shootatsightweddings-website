import { 
  Home, 
  FileText, 
  Image, 
  Film, 
  Phone, 
  HelpCircle, 
  Camera, 
  PenTool, 
  MessageSquare, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import './VisualAdminBar.css';

const pages = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'about', label: 'About', icon: FileText, path: '/about' },
  { id: 'portfolio', label: 'Portfolio', icon: Image, path: '/portfolio' },
  { id: 'wedding-gallery', label: 'Wedding Gallery', icon: Camera, path: '/portfolio/wedding' },
  { id: 'pre-wedding', label: 'Pre-Wedding', icon: Sparkles, path: '/portfolio/pre-wedding' },
  { id: 'films', label: 'Wedding Films', icon: Film, path: '/films' },
  { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, path: '/faq' },
];

export default function VisualAdminBar({ 
  currentPage, 
  onSelectPage, 
  onSelectMode, 
  activeMode, 
  onLogout,
  isSaving,
  lastSaved
}) {
  return (
    <header className="visual-admin-bar">
      {/* Left: Brand & Mode Badge */}
      <div className="vab-left">
        <div className="vab-brand">
          <img 
            src="/shootatsight_logo.webp" 
            alt="Shoot @ Sight" 
            className="vab-logo" 
          />
          <div className="vab-brand-text">
            <span className="vab-title">LIVE VISUAL BUILDER</span>
            <span className="vab-subtitle">WordPress / Elementor Mode</span>
          </div>
        </div>

        <div className="vab-divider"></div>

        {/* Page Switcher Tabs */}
        <div className="vab-pages" role="tablist" aria-label="Select website page to edit">
          <span className="vab-label">PAGES:</span>
          {pages.map((p) => {
            const Icon = p.icon;
            const isActive = activeMode === 'visual-page' && currentPage === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`vab-page-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectMode('visual-page');
                  onSelectPage(p.id);
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Library Shortcuts, Status & Actions */}
      <div className="vab-right">
        {/* Dynamic Content Managers */}
        <div className="vab-managers">
          <button
            type="button"
            className={`vab-manager-btn ${activeMode === 'shoots' ? 'active' : ''}`}
            onClick={() => onSelectMode('shoots')}
            title="Manage Wedding Stories & Gallery Photos"
          >
            <Camera className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Stories &amp; Galleries</span>
          </button>

          <button
            type="button"
            className={`vab-manager-btn ${activeMode === 'blogs' ? 'active' : ''}`}
            onClick={() => onSelectMode('blogs')}
            title="Write and Edit Journal Articles"
          >
            <PenTool className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Journal Articles</span>
          </button>

          <button
            type="button"
            className={`vab-manager-btn ${activeMode === 'testimonials' ? 'active' : ''}`}
            onClick={() => onSelectMode('testimonials')}
            title="Manage Client Reviews & Testimonials"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Testimonials</span>
          </button>
        </div>

        <div className="vab-divider"></div>

        {/* Live Status indicator */}
        <div className="vab-status">
          {isSaving ? (
            <span className="vab-saving-pill">
              <span className="vab-spinner"></span>
              <span>Saving live…</span>
            </span>
          ) : (
            <span className="vab-saved-pill" title={`Last saved: ${lastSaved || 'Ready'}`}>
              <CheckCircle2 className="w-3 h-3 text-[#2ecc71]" />
              <span>Live Synced</span>
            </span>
          )}
        </div>

        {/* Live Site Preview Link */}
        <a 
          href={pages.find(p => p.id === currentPage)?.path || '/'} 
          target="_blank" 
          rel="noreferrer" 
          className="vab-live-btn"
          title="Open live website in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site ↗</span>
        </a>

        {/* Logout */}
        {onLogout && (
          <button 
            type="button" 
            onClick={onLogout} 
            className="vab-logout-btn" 
            title="Sign out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        )}
      </div>
    </header>
  );
}
