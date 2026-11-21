import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Calendar as CalendarIcon, 
  Check, 
  ChevronDown, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { overviewMetrics, clientsList, attentionTasks } from '../data/mockData';

export default function Overview({ onNavigate }) {
  const [tasks, setTasks] = useState(attentionTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1240px]">
      {/* 1. Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-warm-grey">
            YOUR STUDIO, AT A GLANCE
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            Good morning, Pavithra
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            Beautiful stories. Thoughtfully managed.
          </p>
        </div>

        {/* Date Selector & Primary Action */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-surface border border-border-luxury px-3.5 py-2 rounded-md text-[13px] font-medium text-charcoal hover:bg-ivory transition-colors">
            <span>Nov 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-warm-grey" />
          </button>

          <button 
            onClick={() => onNavigate && onNavigate('clients')}
            className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New booking</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 flex flex-col justify-between hover:border-gold/40 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[13px] text-warm-grey">
            <span>Revenue this month</span>
            <ArrowUpRight className="w-4 h-4 text-warm-grey/70" />
          </div>
          <div className="text-[26px] font-bold text-charcoal tracking-tight my-2">
            {overviewMetrics.revenueThisMonth}
          </div>
          <div className="flex items-center space-x-1.5 text-[12px]">
            <span className="text-sage font-medium flex items-center">
              ↗ 31.3%
            </span>
            <span className="text-warm-grey">vs. last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 flex flex-col justify-between hover:border-gold/40 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[13px] text-warm-grey">
            <span>Confirmed bookings</span>
            <ArrowUpRight className="w-4 h-4 text-warm-grey/70" />
          </div>
          <div className="text-[26px] font-bold text-charcoal tracking-tight my-2">
            {overviewMetrics.confirmedBookings}
          </div>
          <div className="flex items-center space-x-1.5 text-[12px]">
            <span className="text-sage font-medium">+3 weddings</span>
            <span className="text-warm-grey">vs. last month</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 flex flex-col justify-between hover:border-gold/40 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[13px] text-warm-grey">
            <span>Outstanding payments</span>
            <ArrowUpRight className="w-4 h-4 text-warm-grey/70" />
          </div>
          <div className="text-[26px] font-bold text-charcoal tracking-tight my-2">
            {overviewMetrics.outstandingPayments}
          </div>
          <div className="flex items-center space-x-1.5 text-[12px]">
            <span className="text-amber font-medium">4 invoices</span>
            <span className="text-warm-grey">awaiting payment</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface border border-border-luxury rounded-[10px] p-5 flex flex-col justify-between hover:border-gold/40 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[13px] text-warm-grey">
            <span>New enquiries</span>
            <ArrowUpRight className="w-4 h-4 text-warm-grey/70" />
          </div>
          <div className="text-[26px] font-bold text-charcoal tracking-tight my-2">
            {overviewMetrics.newEnquiries}
          </div>
          <div className="flex items-center space-x-1.5 text-[12px]">
            <span className="text-gold-dark font-medium">6 to follow up</span>
            <span className="text-warm-grey">this month</span>
          </div>
        </div>
      </div>

      {/* 3. Mid Section: Revenue Overview & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Revenue Overview (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-border-luxury rounded-[10px] p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-[22px] font-medium text-charcoal">Revenue overview</h2>
                <p className="text-[13px] text-warm-grey mt-0.5">A little more growth. A lot more stories.</p>
              </div>
              <button className="flex items-center space-x-2 bg-ivory border border-border-luxury px-3 py-1.5 rounded-md text-[12px] text-charcoal">
                <span>Last 6 months</span>
                <ChevronDown className="w-3 h-3 text-warm-grey" />
              </button>
            </div>

            {/* Total Metric & Legend */}
            <div className="flex items-baseline justify-between mt-4 pb-2 border-b border-border-luxury/50">
              <div className="flex items-baseline space-x-2">
                <span className="text-[28px] font-bold text-charcoal tracking-tight">
                  {overviewMetrics.sixMonthTotal}
                </span>
                <span className="bg-sage-light text-sage text-[11px] font-semibold px-2 py-0.5 rounded">
                  {overviewMetrics.sixMonthGrowth}
                </span>
                <span className="text-[12px] text-warm-grey hidden sm:inline ml-1">
                  collected over the last 6 months
                </span>
              </div>

              <div className="flex items-center space-x-4 text-[12px] text-warm-grey">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold"></span>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-warm-grey/60"></span>
                  <span>Expenses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-8 pt-4">
            <div className="h-44 flex items-end justify-between px-2 sm:px-6">
              {overviewMetrics.monthlyTrend.map((m) => (
                <div key={m.month} className="flex flex-col items-center group">
                  <div className="flex items-end space-x-1.5 h-36">
                    {/* Revenue Bar */}
                    <div 
                      style={{ height: `${(m.revenue / 9) * 100}%` }}
                      className="w-5 sm:w-8 bg-gold rounded-t-sm group-hover:bg-gold-hover transition-all relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap transition-opacity">
                        ₹{m.revenue}L
                      </div>
                    </div>
                    {/* Expense Bar */}
                    <div 
                      style={{ height: `${(m.expenses / 9) * 100}%` }}
                      className="w-3 sm:w-5 bg-border-luxury rounded-t-sm group-hover:bg-warm-grey/40 transition-all"
                    ></div>
                  </div>
                  <span className="text-[12px] font-medium text-warm-grey mt-3">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border-luxury flex justify-between text-[10px] text-warm-grey pt-1.5 px-2">
              <span>₹0</span>
              <span>₹3L</span>
              <span>₹6L</span>
              <span>₹9L</span>
            </div>
          </div>
        </div>

        {/* Right: Upcoming Events (4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-serif text-[20px] font-medium text-charcoal">On the horizon</h2>
              <button 
                onClick={() => onNavigate && onNavigate('calendar')}
                className="text-[12px] font-medium text-gold hover:underline flex items-center"
              >
                <span>View calendar</span>
                <span className="ml-1 text-[10px]">↗</span>
              </button>
            </div>

            {/* Editorial Photograph Quote Banner */}
            <div className="relative rounded-lg overflow-hidden bg-charcoal text-white p-4 mb-4">
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-20">
                <Sparkles className="w-4 h-4 text-gold mb-1" />
                <div className="font-serif text-[16px] italic text-ivory">
                  “Every detail, remembered.”
                </div>
                <div className="text-[10px] text-warm-grey tracking-wider uppercase mt-1">
                  Shoot @ Sight Creative Standard
                </div>
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3.5 p-2 rounded-lg hover:bg-ivory transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-ivory border border-border-luxury flex flex-col items-center justify-center text-center">
                  <span className="text-[14px] font-bold text-charcoal leading-none">21</span>
                  <span className="text-[9px] font-semibold text-gold tracking-wider uppercase">NOV</span>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-charcoal">Aarav & Meera</div>
                  <div className="text-[11px] text-warm-grey">Wedding · The Leela, Bengaluru</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-warm-grey" />
              </div>

              <div className="h-px bg-border-luxury/60"></div>

              <div className="flex items-center space-x-3.5 p-2 rounded-lg hover:bg-ivory transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-ivory border border-border-luxury flex flex-col items-center justify-center text-center">
                  <span className="text-[14px] font-bold text-charcoal leading-none">24</span>
                  <span className="text-[9px] font-semibold text-gold tracking-wider uppercase">NOV</span>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-charcoal">Rohan & Ananya</div>
                  <div className="text-[11px] text-warm-grey">Engagement · Taj West End</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-warm-grey" />
              </div>

              <div className="h-px bg-border-luxury/60"></div>

              <div className="flex items-center space-x-3.5 p-2 rounded-lg hover:bg-ivory transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-md bg-ivory border border-border-luxury flex flex-col items-center justify-center text-center">
                  <span className="text-[14px] font-bold text-charcoal leading-none">28</span>
                  <span className="text-[9px] font-semibold text-gold tracking-wider uppercase">NOV</span>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-charcoal">Karthik & Diya</div>
                  <div className="text-[11px] text-warm-grey">Muhurtham · Lalitha Mahal, Mysuru</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-warm-grey" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Bookings & Needs Your Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Bookings (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-border-luxury rounded-[10px] p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-border-luxury/60">
            <div>
              <div className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider">Stories in the making</div>
              <h2 className="font-serif text-[22px] font-medium text-charcoal">Recent bookings</h2>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('bookings')}
              className="text-[12px] font-medium text-gold hover:underline flex items-center"
            >
              <span>View all bookings</span>
              <span className="ml-1 text-[10px]">↗</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left mt-2">
              <thead>
                <tr className="border-b border-border-luxury text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                  <th className="py-3 px-2">CLIENT / BOOKING</th>
                  <th className="py-3 px-2">EVENT DATE</th>
                  <th className="py-3 px-2">PACKAGE</th>
                  <th className="py-3 px-2 text-right">VALUE</th>
                  <th className="py-3 px-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-luxury/50 text-[13px]">
                {clientsList.slice(0, 3).map((client) => (
                  <tr key={client.id} className="hover:bg-ivory/60 transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="font-semibold text-charcoal">{client.couple}</div>
                      <div className="text-[11px] text-warm-grey">{client.bookingId} · {client.city}</div>
                    </td>
                    <td className="py-3.5 px-2 text-warm-grey font-medium">
                      {client.weddingDate}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="text-[12px] font-medium text-charcoal bg-ivory px-2 py-0.5 rounded border border-border-luxury">
                        {client.package}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right font-semibold text-charcoal">
                      {client.value}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        client.statusType === 'confirmed'
                          ? 'bg-sage-light text-sage border border-sage/20'
                          : 'bg-amber-light text-amber border border-amber/20'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Needs Your Attention (4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-luxury/60">
              <div>
                <h2 className="font-serif text-[20px] font-medium text-charcoal">A little attention</h2>
                <p className="text-[12px] text-warm-grey">The small things that keep it all moving.</p>
              </div>
              <span className="text-[11px] font-bold bg-amber-light text-amber px-2 py-0.5 rounded-full border border-amber/20">
                03
              </span>
            </div>

            {/* Checklist items */}
            <div className="mt-4 space-y-3.5">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    task.done 
                      ? 'bg-ivory/50 border-border-luxury/50 opacity-60' 
                      : 'bg-ivory border-border-luxury hover:border-gold/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                    task.done 
                      ? 'bg-gold border-gold text-white' 
                      : 'border-warm-grey/50 bg-white'
                  }`}>
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[13px] font-medium text-charcoal ${task.done ? 'line-through text-warm-grey' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-warm-grey mt-0.5">{task.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border-luxury/60 text-[11px] text-warm-grey flex items-center justify-between">
            <span>Automated studio sync</span>
            <span className="text-sage font-medium">● Operational</span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Health Pill & Footnote */}
      <div className="bg-surface border border-border-luxury rounded-[10px] px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] shadow-subtle">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
          <span className="font-semibold text-charcoal">Your studio is in sync.</span>
          <span className="text-warm-grey hidden sm:inline">· 6 enquiries → 4 quotations → 3 new bookings this week</span>
        </div>
        <button 
          onClick={() => onNavigate && onNavigate('bookings')}
          className="text-gold font-medium text-[12px] hover:underline flex items-center"
        >
          <span>View pipeline</span>
          <span className="ml-1 text-[10px]">↗</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between text-[11px] text-warm-grey/80 px-1 pt-2">
        <span>A thoughtfully organised studio. More room for what you love.</span>
        <span>Sample business data · INR</span>
      </div>
    </div>
  );
}
