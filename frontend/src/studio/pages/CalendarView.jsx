import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalIcon, 
  MapPin, 
  Users, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { calendarEvents } from '../data/mockData';

export default function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(21);

  // November 2026 starts on Sunday (day 0) and has 30 days
  const daysInNov = Array.from({ length: 30 }, (_, i) => i + 1);

  const selectedEvent = calendarEvents.find(e => e.day === selectedDay);

  return (
    <div className="space-y-6 pb-12 max-w-[1240px]">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-warm-grey">
            A LITTLE SPACE FOR EVERY STORY
          </div>
          <h1 className="font-serif text-[38px] font-medium text-charcoal leading-tight mt-1">
            Calendar
          </h1>
          <p className="text-[14px] text-warm-grey mt-0.5">
            Your celebrations, conversations, and creative deadlines.
          </p>
        </div>

        <button className="flex items-center space-x-1.5 bg-gold hover:bg-gold-hover text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors shadow-xs">
          <Plus className="w-4 h-4" />
          <span>Add event</span>
        </button>
      </div>

      {/* 2. Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Month Calendar (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-border-luxury rounded-[10px] p-6 shadow-subtle space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-border-luxury">
            <h2 className="font-serif text-[22px] font-medium text-charcoal">
              November 2026
            </h2>

            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-md hover:bg-ivory border border-border-luxury text-warm-grey hover:text-charcoal transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2.5 py-1 text-[12px] font-medium border border-border-luxury rounded-md bg-ivory text-charcoal">
                Today
              </button>
              <button className="p-1.5 rounded-md hover:bg-ivory border border-border-luxury text-warm-grey hover:text-charcoal transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-warm-grey uppercase tracking-wider py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysInNov.map((d) => {
              const eventOnDay = calendarEvents.find(e => e.day === d);
              const isSelected = selectedDay === d;

              return (
                <div
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`min-h-[78px] p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-gold bg-gold-light/40 shadow-xs ring-1 ring-gold'
                      : eventOnDay
                      ? 'bg-ivory border-border-luxury hover:border-gold/50'
                      : 'bg-surface border-border-luxury/60 hover:bg-ivory/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[12px] font-semibold ${isSelected ? 'text-gold-dark' : 'text-charcoal'}`}>
                      {d}
                    </span>
                    {d === 18 && (
                      <span className="text-[9px] bg-charcoal text-white px-1 py-0.2 rounded font-medium">
                        Today
                      </span>
                    )}
                  </div>

                  {eventOnDay && (
                    <div className="mt-1">
                      <div className="text-[10px] font-semibold truncate text-charcoal px-1.5 py-0.5 rounded bg-white border border-border-luxury">
                        {eventOnDay.title.split('·')[0]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Agenda & Filters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Day Detail Card */}
          <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-luxury">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-warm-grey font-semibold">
                  Today’s Agenda
                </div>
                <h3 className="font-serif text-[20px] font-medium text-charcoal">
                  {selectedDay} November 2026
                </h3>
              </div>
              <CalIcon className="w-4 h-4 text-gold" />
            </div>

            {selectedEvent ? (
              <div className="p-4 rounded-lg bg-ivory border border-border-luxury space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gold-dark bg-gold-light px-2 py-0.5 rounded border border-gold/30">
                    {selectedEvent.type}
                  </span>
                  <span className="text-[11px] text-warm-grey">Full Day</span>
                </div>

                <div className="font-serif text-[18px] font-medium text-charcoal leading-snug">
                  {selectedEvent.title}
                </div>

                <div className="space-y-1.5 text-[12px] text-warm-grey pt-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{selectedEvent.venue}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>Crew: {selectedEvent.crew}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-ivory/60 border border-dashed border-border-luxury text-center text-warm-grey text-[13px]">
                No wedding events booked for {selectedDay} Nov.
                <button className="block mx-auto mt-2 text-[12px] font-medium text-gold hover:underline">
                  + Schedule shoot
                </button>
              </div>
            )}
          </div>

          {/* Category Legend & Filters */}
          <div className="bg-surface border border-border-luxury rounded-[10px] p-5 shadow-subtle space-y-3">
            <div className="text-[12px] font-semibold text-charcoal uppercase tracking-wider">
              Calendar Categories
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
                  <span className="text-charcoal font-medium">Wedding Ceremonies</span>
                </div>
                <span className="text-warm-grey text-[11px]">8</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blush border border-charcoal/20"></span>
                  <span className="text-charcoal font-medium">Pre-Wedding Shoots</span>
                </div>
                <span className="text-warm-grey text-[11px]">4</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>
                  <span className="text-charcoal font-medium">Client Consultations</span>
                </div>
                <span className="text-warm-grey text-[11px]">6</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral"></span>
                  <span className="text-charcoal font-medium">Payment Milestones</span>
                </div>
                <span className="text-warm-grey text-[11px]">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
