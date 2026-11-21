import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Receipt, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { invoicesList, studioOwner } from '../data/mockData';

export default function Invoices() {
  const [selectedInv, setSelectedInv] = useState(invoicesList[3]); // Karthik & Diya overdue

  return (
    <div className="space-y-6 pb-12 max-w-[1240px]">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-warm-grey">
            GOOD WORK. CLEAR PAYMENTS.
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            Invoices
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            Know what’s paid, what’s due, and what needs a gentle reminder.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 bg-surface border border-border-luxury px-3.5 py-2 rounded-md text-[13px] font-medium text-charcoal hover:bg-ivory transition-colors">
            <Download className="w-3.5 h-3.5 text-warm-grey" />
            <span>Export</span>
          </button>

          <button className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Create invoice</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">Collected this month</div>
          <div className="text-[28px] font-bold text-charcoal tracking-tight my-1.5">₹8,40,000</div>
          <div className="text-[12px] text-sage font-medium">100% on-time milestone clearance</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">Outstanding balance</div>
          <div className="text-[28px] font-bold text-charcoal tracking-tight my-1.5">₹3,25,000</div>
          <div className="text-[12px] text-warm-grey">Across 4 wedding projects</div>
        </div>

        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] text-warm-grey">Overdue balance</div>
          <div className="text-[28px] font-bold text-coral tracking-tight my-1.5">₹1,26,000</div>
          <div className="text-[12px] text-coral font-medium">1 invoice requiring gentle reminder</div>
        </div>
      </div>

      {/* 3. Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Invoice Table (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle">
          <div className="text-[13px] font-semibold text-charcoal pb-3 border-b border-border-luxury">
            Invoice Records
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left mt-2">
              <thead>
                <tr className="border-b border-border-luxury text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                  <th className="py-2.5 px-3">INVOICE #</th>
                  <th className="py-2.5 px-3">CLIENT</th>
                  <th className="py-2.5 px-3">DUE DATE</th>
                  <th className="py-2.5 px-3 text-right">AMOUNT</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-luxury/50 text-[13px]">
                {invoicesList.map((inv) => {
                  const isSelected = selectedInv?.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInv(inv)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-gold-light/40 border-l-2 border-gold' : 'hover:bg-ivory/60'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-mono font-medium text-charcoal">
                        {inv.id}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-charcoal">{inv.client}</div>
                        <div className="text-[11px] text-warm-grey">{inv.type}</div>
                      </td>
                      <td className="py-3.5 px-3 text-warm-grey">
                        {inv.dueDate}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-charcoal">
                        {inv.amount}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          inv.status === 'Paid'
                            ? 'bg-sage-light text-sage border border-sage/20'
                            : 'bg-coral-light text-coral border border-coral/20'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Invoice Detail (4 cols) */}
        {selectedInv && (
          <div className="lg:col-span-4 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-bold text-charcoal bg-ivory px-2 py-0.5 rounded border border-border-luxury">
                  {selectedInv.id}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  selectedInv.status === 'Paid'
                    ? 'bg-sage-light text-sage border border-sage/20'
                    : 'bg-coral-light text-coral border border-coral/20'
                }`}>
                  {selectedInv.status}
                </span>
              </div>

              <h3 className="font-serif text-[22px] font-medium text-charcoal mt-2">
                {selectedInv.client}
              </h3>
              <p className="text-[12px] text-warm-grey">{selectedInv.type}</p>
            </div>

            <div className="p-4 bg-ivory rounded-lg border border-border-luxury space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                Amount Due
              </div>
              <div className="text-[28px] font-bold text-charcoal tracking-tight">
                {selectedInv.amount}
              </div>
              <div className="text-[11px] text-warm-grey">
                Due by: <span className="font-semibold text-charcoal">{selectedInv.dueDate}</span>
              </div>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-border-luxury/60">
                <span className="text-warm-grey">Invoice Date</span>
                <span className="font-medium text-charcoal">{selectedInv.issueDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-luxury/60">
                <span className="text-warm-grey">Payment Method</span>
                <span className="font-medium text-charcoal">{selectedInv.method}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-warm-grey">GST Tax (18%)</span>
                <span className="font-medium text-charcoal">Included (CGST + SGST)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={() => {
                  const msg = `Hello ${selectedInv.client}, this is Pavithra from Shoot @ Sight. A gentle reminder regarding invoice ${selectedInv.id} for ${selectedInv.amount} due on ${selectedInv.dueDate}.`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-sage-light hover:bg-sage/20 text-sage font-medium text-[13px] rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Reminder</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-surface hover:bg-ivory border border-border-luxury text-charcoal font-medium text-[13px] rounded-md transition-colors"
              >
                <Printer className="w-4 h-4 text-warm-grey" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
