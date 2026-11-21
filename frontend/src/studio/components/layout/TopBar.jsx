import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Plus, ExternalLink, LogOut } from 'lucide-react';
import { studioOwner } from '../../data/mockData';

export default function TopBar({ activeTitle, onQuickAdd, onLogout, userEmail }) {
  return (
    <header className="h-[70px] bg-surface border-b border-border-luxury px-8 flex items-center justify-between sticky top-0 z-20 no-print">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-2 text-[13px]">
        <span className="text-warm-grey">Shoot @ Sight</span>
        <span className="text-border-luxury font-light">/</span>
        <span className="font-semibold text-charcoal capitalize">{activeTitle}</span>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-[380px] mx-8">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-warm-grey absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients, events, stories, proposals…"
            className="w-full bg-ivory border border-border-luxury rounded-lg pl-9 pr-14 py-2 text-[12.5px] text-charcoal placeholder:text-warm-grey/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <div className="absolute right-2.5 flex items-center bg-surface border border-border-luxury px-1.5 py-0.5 rounded text-[10px] text-warm-grey font-mono">
            ⌘ K
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center space-x-3">
        {/* Live Website Link */}
        <a 
          href="/" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center space-x-1.5 bg-ivory hover:bg-border-luxury/50 border border-border-luxury text-charcoal text-[11.5px] font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-gold" />
          <span>Live Site ↗</span>
        </a>

        {/* Quick Add CTA */}
        {onQuickAdd && (
          <button 
            onClick={onQuickAdd}
            className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white text-[11.5px] font-medium px-3 py-1.5 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        )}

        <div className="h-5 w-px bg-border-luxury"></div>

        {/* User Workspace Info with Logout */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="text-right">
            <div className="text-[11.5px] font-semibold text-charcoal leading-tight">{studioOwner.name}</div>
            <div className="text-[10px] text-warm-grey truncate max-w-[120px]">{userEmail || studioOwner.role}</div>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 hover:text-coral text-warm-grey hover:bg-ivory rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
