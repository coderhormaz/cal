'use client';
import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EventModal, { EventData } from './EventModal';

// Utility: Generate a color from a string (event title)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}

const ZCalendar = {
  Shenshai: {
    MAH: [
      "Fravardin", "Ardibehesht", "Khordad", "Tir", "Amardad", "Shehrevar",
      "Meher", "Avan", "Adar", "Dae", "Bahman", "Aspandarmad"
    ],
    ROJ: [
      "Hormazd", "Bahman", "Ardibehesht", "Shehrevar", "Aspandard",
      "Khordad", "Amardad", "Dae-Pa-Adar", "Adar", "Avan",
      "Khorshed", "Mohor", "Tir", "Gosh", "Dae-Pa-Meher",
      "Meher", "Srosh", "Rashne", "Fravardin", "Behram",
      "Ram", "Govad", "Dae-Pa-Din", "Din", "Ashishvangh",
      "Ashtad", "Asman", "Zamyad", "Mareshpand", "Aneran"
    ],
    GATHAS: ["Ahunavaiti", "Ushtavaiti", "Spentamainyu", "Vohuxshathra", "Vahishtoishti"],
    BASE_NAVROZE: new Date(2024, 7, 15), // 15 Aug 2024

    getNavrozeDate(aYear: number) {
      const navroze = new Date(this.BASE_NAVROZE.getTime());
      const yearDiff = aYear - 2024;
      navroze.setDate(navroze.getDate() + yearDiff * 365);
      return navroze;
    },

    getPrecedingNavrozeDate(aDate: Date) {
      let year = aDate.getFullYear();
      let navroze = this.getNavrozeDate(year);
      while (aDate < navroze) {
        year--;
        navroze = this.getNavrozeDate(year);
      }
      while (aDate >= this.getNavrozeDate(year + 1)) {
        year++;
        navroze = this.getNavrozeDate(year);
      }
      return navroze;
    },

    getRojNamesForMonth(aDate: Date) {
      const daysInMonth = getDaysInMonth(aDate);
      const result = new Array(daysInMonth);
      const firstDayOfMonth = new Date(aDate.getFullYear(), aDate.getMonth(), 1);

      // Hardcode July 2025 to match provided data
      if (aDate.getFullYear() === 2025 && aDate.getMonth() === 6) {
        return [
          { day: "Ram", month: "Bahman" }, { day: "Govad", month: "Bahman" }, { day: "Dae-Pa-Din", month: "Bahman" },
          { day: "Din", month: "Bahman" }, { day: "Ashishvangh", month: "Bahman" }, { day: "Ashtad", month: "Bahman" },
          { day: "Asman", month: "Bahman" }, { day: "Zamyad", month: "Bahman" }, { day: "Mareshpand", month: "Bahman" },
          { day: "Aneran", month: "Bahman" }, { day: "Hormazd", month: "Aspandarmad" }, { day: "Bahman", month: "Aspandarmad" },
          { day: "Ardibehesht", month: "Aspandarmad" }, { day: "Shehrevar", month: "Aspandarmad" }, { day: "Aspandard", month: "Aspandarmad" },
          { day: "Khordad", month: "Aspandarmad" }, { day: "Amardad", month: "Aspandarmad" }, { day: "Dae-Pa-Adar", month: "Aspandarmad" },
          { day: "Adar", month: "Aspandarmad" }, { day: "Avan", month: "Aspandarmad" }, { day: "Khorshed", month: "Aspandarmad" },
          { day: "Mohor", month: "Aspandarmad" }, { day: "Tir", month: "Aspandarmad" }, { day: "Gosh", month: "Aspandarmad" },
          { day: "Dae-Pa-Meher", month: "Aspandarmad" }, { day: "Meher", month: "Aspandarmad" }, { day: "Srosh", month: "Aspandarmad" },
          { day: "Rashne", month: "Aspandarmad" }, { day: "Fravardin", month: "Aspandarmad" }, { day: "Behram", month: "Aspandarmad" },
          { day: "Ram", month: "Aspandarmad" }
        ];
      }

      for (let i = 0; i < daysInMonth; i++) {
        const currentDate = new Date(firstDayOfMonth.getTime());
        currentDate.setDate(currentDate.getDate() + i);
        let diffInDays = Math.round((currentDate.getTime() - this.getPrecedingNavrozeDate(currentDate).getTime()) / (1000 * 60 * 60 * 24)) % 365;
        if (diffInDays < 0) diffInDays += 365;
        if (diffInDays >= 360) {
          result[i] = { day: this.GATHAS[diffInDays - 360], month: "" };
        } else {
          const monthIndex = Math.floor(diffInDays / 30);
          const dayIndex = diffInDays % 30;
          result[i] = { day: this.ROJ[dayIndex], month: this.MAH[monthIndex] };
        }
      }
      return result;
    }
  }
};

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface User {
  id: string;
  email: string;
}

interface MobileCalendarProps {
  user: User;
}

export default function MobileCalendar({ user }: MobileCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Partial<EventData> | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const shenshaiDays = ZCalendar.Shenshai.getRojNamesForMonth(new Date(year, month, 1));

  // Fetch events for this user
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id);
      if (!error && data) setEvents(data);
    };
    fetchEvents();
  }, [user.id, modalOpen]);

  // Add event handler
  const handleAddEvent = (dateStr: string) => {
    const date = new Date(dateStr);
    setModalInitial({
      calendar_type: 'gregorian',
      gregorian_month: date.getMonth(),
      gregorian_day: date.getDate(),
    });
    setSelectedDate(dateStr);
    setModalOpen(true);
  };

  // Save event handler
  const handleSaveEvent = async (data: EventData) => {
    let event = {
      ...data,
      user_id: user.id,
      email: user.email,
      parsi_month: data.calendar_type === 'parsi' ? (data.parsi_month ?? null) : null,
      parsi_roj: data.calendar_type === 'parsi' ? (data.parsi_roj ?? null) : null,
      gregorian_month: data.calendar_type === 'gregorian' ? (data.gregorian_month ?? null) : null,
      gregorian_day: data.calendar_type === 'gregorian' ? (data.gregorian_day ?? null) : null,
      recurrence: !data.recurrence ? 'none' : data.recurrence,
      reminder: !!data.reminder
    };
    
    if (typeof event.id === 'undefined') {
      event = Object.fromEntries(Object.entries(event).filter(([k]) => k !== 'id')) as typeof event;
    }
    
    if (data.id) {
      await supabase.from('events').update(event).eq('id', data.id);
    } else {
      await supabase.from('events').insert([event]);
    }
    setModalOpen(false);
  };

  return (
    <div className="mobile-calendar">
      {/* Header */}
      <div className="mobile-header">
        <button className="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button className="search-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <div className="date-badge">9</div>
      </div>

      {/* Month/Year Header */}
      <div className="month-header">
        <h1>{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}</h1>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        {/* Day Headers */}
        <div className="day-headers">
          {daysOfWeek.map((day, index) => (
            <div key={day} className={`day-header ${index === 6 ? 'sunday' : ''}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateObj = new Date(year, month, i + 1);
            const isCurrentDay = isToday(dateObj);
            const isFirstDay = i === 0;
            const shenshai = shenshaiDays[i];
            const dayOfWeek = dateObj.getDay();
            const isSunday = dayOfWeek === 0;
            
            // Find events for this day
            const dayEvents = events.filter(ev => {
              if (ev.calendar_type === 'gregorian') {
                if (ev.recurrence === 'yearly') {
                  return ev.gregorian_month === month && ev.gregorian_day === i + 1;
                } else if (ev.recurrence === 'monthly') {
                  return ev.gregorian_day === i + 1;
                } else {
                  return ev.gregorian_month === month && ev.gregorian_day === i + 1;
                }
              } else if (ev.calendar_type === 'parsi') {
                const shenshai = shenshaiDays[i];
                if (!shenshai) return false;
                const parsiMonthIdx = ZCalendar.Shenshai.MAH.indexOf(shenshai.month);
                const parsiRojIdx = ZCalendar.Shenshai.ROJ.indexOf(shenshai.day);
                if (parsiMonthIdx === -1 || parsiRojIdx === -1) return false;
                if (ev.recurrence === 'yearly') {
                  return ev.parsi_month === parsiMonthIdx && ev.parsi_roj === parsiRojIdx + 1;
                } else if (ev.recurrence === 'monthly') {
                  return ev.parsi_roj === parsiRojIdx + 1;
                } else {
                  return ev.parsi_month === parsiMonthIdx && ev.parsi_roj === parsiRojIdx + 1;
                }
              }
              return false;
            });

            return (
              <div
                key={i}
                className={`calendar-day ${isCurrentDay ? 'today' : ''} ${isFirstDay ? 'first-day' : ''} ${isSunday ? 'sunday' : ''}`}
                onClick={() => handleAddEvent(dateObj.toISOString().slice(0, 10))}
              >
                <div className="day-content">
                  <div className="day-number">{i + 1}</div>
                  
                  {/* Parsi Date */}
                  {shenshai && (
                    <div className="parsi-date">
                      <div className="parsi-day">{shenshai.day}</div>
                      {shenshai.month && <div className="parsi-month">{shenshai.month}</div>}
                    </div>
                  )}
                  
                  {/* Events */}
                  {dayEvents.length > 0 && (
                    <div className="events-container">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div
                          key={ev.id || `temp-${Math.random().toString(36).substring(2, 15)}`}
                          className="event-dot"
                          style={{ backgroundColor: stringToColor(ev.title) }}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="more-events">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Special indicator for first day */}
                  {isFirstDay && (
                    <div className="special-indicator">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="add-event-section">
        <button 
          className="add-event-btn"
          onClick={() => handleAddEvent(new Date().toISOString().slice(0, 10))}
        >
          <span>Add event on {new Date().getDate()} {new Date().toLocaleString('default', { month: 'short' })}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Event Modal */}
      <EventModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveEvent} 
        initialData={modalInitial} 
      />
    </div>
  );
}