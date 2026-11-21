import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Receipt, 
  ArrowUpRight,
  Sparkles,
  Check
} from 'lucide-react';
import { clientsList } from '../data/mockData';

export default function Clients({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(clientsList[0]);

  const filteredClients = clientsList.filter(c => {
    const matchesSearch = c.couple.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'active') return matchesSearch && c.statusType !== 'completed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1240px]">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-warm-grey">
            RELATIONSHIPS, BEAUTIFULLY KEPT
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            Clients
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            Every couple. Every conversation. One considered place.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 bg-surface border border-border-luxury px-3.5 py-2 rounded-md text-[13px] font-medium text-charcoal hover:bg-ivory transition-colors">
            <Download className="w-3.5 h-3.5 text-warm-grey" />
            <span>Export</span>
          </button>

          <button className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Add client</span>
          </button>
        </div>
      </div>

      {/* 2. 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">All clients</div>
          <div className="text-[28px] font-bold text-charcoal tracking-tight my-1.5">68</div>
          <div className="text-[12px] text-warm-grey">Your growing community</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">Active projects</div>
          <div className="text-[28px] font-bold text-charcoal tracking-tight my-1.5">18</div>
          <div className="text-[12px] text-warm-grey">From planning to delivery</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">Returning & referred</div>
          <div className="text-[28px] font-bold text-charcoal tracking-tight my-1.5">42%</div>
          <div className="text-[12px] text-warm-grey">The best kind of connection</div>
        </div>
      </div>

      {/* 3. Split Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Clients Directory Table (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          {/* Tabs & Search */}
          <div className="border-b border-border-luxury pb-3">
            <div className="flex items-center space-x-6 text-[13px] font-medium">
              <button 
                onClick={() => setActiveTab('all')}
                className={`pb-2 relative ${activeTab === 'all' ? 'text-charcoal font-semibold' : 'text-warm-grey hover:text-charcoal'}`}
              >
                All clients <span className="text-[11px] text-warm-grey ml-1 font-normal">68</span>
                {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></span>}
              </button>

              <button 
                onClick={() => setActiveTab('active')}
                className={`pb-2 relative ${activeTab === 'active' ? 'text-charcoal font-semibold' : 'text-warm-grey hover:text-charcoal'}`}
              >
                Active <span className="text-[11px] text-warm-grey ml-1 font-normal">18</span>
                {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></span>}
              </button>

              <button 
                onClick={() => setActiveTab('completed')}
                className={`pb-2 relative ${activeTab === 'completed' ? 'text-charcoal font-semibold' : 'text-warm-grey hover:text-charcoal'}`}
              >
                Completed <span className="text-[11px] text-warm-grey ml-1 font-normal">50</span>
                {activeTab === 'completed' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></span>}
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-3 my-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-warm-grey absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients by name, booking ID, or city…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-ivory border border-border-luxury rounded-lg pl-9 pr-4 py-2 text-[13px] text-charcoal placeholder:text-warm-grey/70 focus:outline-none focus:border-gold"
              />
            </div>
            <button className="flex items-center space-x-1.5 bg-ivory border border-border-luxury px-3.5 py-2 rounded-lg text-[13px] text-charcoal hover:bg-border-luxury/40">
              <Filter className="w-3.5 h-3.5 text-warm-grey" />
              <span>Filters</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-luxury text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                  <th className="py-2.5 px-3">CLIENT</th>
                  <th className="py-2.5 px-3">WEDDING DATE</th>
                  <th className="py-2.5 px-3">PACKAGE</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-luxury/50 text-[13px]">
                {filteredClients.map((client) => {
                  const isSelected = selectedClient?.id === client.id;
                  return (
                    <tr 
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-gold-light/40 border-l-2 border-gold' : 'hover:bg-ivory/60'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-semibold text-charcoal">{client.couple}</div>
                        <div className="text-[11px] text-warm-grey">{client.bookingId} · {client.city}</div>
                      </td>
                      <td className="py-3 px-3 text-warm-grey font-medium">
                        {client.weddingDate}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[12px] font-medium text-charcoal bg-ivory px-2 py-0.5 rounded border border-border-luxury">
                          {client.package}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          client.statusType === 'confirmed'
                            ? 'bg-sage-light text-sage border border-sage/20'
                            : client.statusType === 'warning'
                            ? 'bg-amber-light text-amber border border-amber/20'
                            : 'bg-ivory text-warm-grey border border-border-luxury'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Client Profile Card (4 cols) */}
        {selectedClient && (
          <div className="lg:col-span-4 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle space-y-5">
            {/* Profile Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-warm-grey bg-ivory px-2 py-0.5 rounded border border-border-luxury">
                  {selectedClient.id}
                </span>
                <span className="text-[11px] font-medium text-sage bg-sage-light px-2 py-0.5 rounded-full border border-sage/20">
                  {selectedClient.status}
                </span>
              </div>
              <h3 className="font-serif text-[24px] font-medium text-charcoal mt-2">
                {selectedClient.couple}
              </h3>
              <p className="text-[12px] text-warm-grey">
                {selectedClient.bookingId} · {selectedClient.city}
              </p>
            </div>

            {/* Quick Contact Bar */}
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <a 
                href={`https://wa.me/${selectedClient.phone.replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2 bg-sage-light hover:bg-sage/20 text-sage font-medium rounded-md transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a 
                href={`tel:${selectedClient.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2 bg-ivory hover:bg-border-luxury/40 text-charcoal font-medium rounded-md border border-border-luxury transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-warm-grey" />
                <span>Call</span>
              </a>
            </div>

            {/* Client Journey Milestone Progress */}
            <div className="p-3 bg-ivory rounded-lg border border-border-luxury space-y-2">
              <div className="flex items-center justify-between text-[11px] text-warm-grey font-medium uppercase tracking-wider">
                <span>Journey Stage</span>
                <span className="text-gold-dark font-semibold">Stage 5 of 8</span>
              </div>
              <div className="w-full bg-border-luxury h-1.5 rounded-full overflow-hidden">
                <div className="bg-gold h-full w-[65%] rounded-full"></div>
              </div>
              <div className="text-[11px] text-charcoal font-medium">
                Advance received · Pre-wedding shoot planning
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3.5 rounded-lg border border-border-luxury space-y-2.5">
              <div className="text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                Financial Breakdown
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-warm-grey">Booking Value</span>
                <span className="font-semibold text-charcoal">{selectedClient.value}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-warm-grey">Paid to date</span>
                <span className="font-semibold text-sage">{selectedClient.paid}</span>
              </div>
              <div className="flex justify-between text-[13px] pt-1.5 border-t border-border-luxury">
                <span className="text-charcoal font-medium">Balance Due</span>
                <span className="font-bold text-coral">{selectedClient.balance}</span>
              </div>
            </div>

            {/* Wedding Details */}
            <div className="space-y-2 text-[12px]">
              <div className="flex items-start space-x-2 text-charcoal">
                <Calendar className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{selectedClient.weddingDate}</span>
                  <div className="text-[11px] text-warm-grey">{selectedClient.events.join(" · ")}</div>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-charcoal pt-1">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <span>{selectedClient.venue}</span>
                </div>
              </div>
            </div>

            {/* Assigned Crew */}
            <div className="pt-2 border-t border-border-luxury">
              <div className="text-[11px] uppercase tracking-wider text-warm-grey font-semibold mb-1.5">
                Assigned Team
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedClient.crew.map((member, idx) => (
                  <span key={idx} className="text-[11px] bg-ivory text-charcoal px-2 py-0.5 rounded border border-border-luxury">
                    {member}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button 
                onClick={() => onNavigate && onNavigate('quotations')}
                className="flex items-center justify-center space-x-1.5 py-2 bg-surface hover:bg-ivory border border-border-luxury rounded-md text-[12px] font-medium text-charcoal transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-gold" />
                <span>Quotation</span>
              </button>

              <button 
                onClick={() => onNavigate && onNavigate('invoices')}
                className="flex items-center justify-center space-x-1.5 py-2 bg-surface hover:bg-ivory border border-border-luxury rounded-md text-[12px] font-medium text-charcoal transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-gold" />
                <span>Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
