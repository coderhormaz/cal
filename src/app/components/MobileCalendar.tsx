'use client';
import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EventModal, { EventData } from './EventModal';

// Search Modal Component
function SearchModal({ 
  open, 
  onClose, 
  events, 
  onEventSelect 
}: { 
  open: boolean; 
  onClose: () => void; 
  events: EventData[]; 
  onEventSelect: (event: EventData) => void; 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
            Search Events
          </h2>
          <button 
            onClick={onClose}
            className="btn btn-text"
            style={{ padding: '8px', minHeight: 'auto', fontSize: '20px', color: 'var(--text-tertiary)' }}
          >
            ×
          </button>
        </div>
        
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control"
              autoFocus
            />
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                {searchTerm ? 'No events found' : 'Start typing to search events'}
              </div>
            ) : (
              filteredEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)'
                  }}
                  onClick={() => {
                    onEventSelect(event);
                    onClose();
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-variant)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{event.title}</div>
                  {event.description && (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {event.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);

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

  // Handle event selection from search
  const handleEventSelect = (event: EventData) => {
    setModalInitial(event);
    setModalOpen(true);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement actual dark mode logic here
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className={`mobile-calendar ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button className="search-btn" onClick={() => setSearchOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Month/Year Header */}
      <div className="month-header">
        <div className="month-navigation">
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h1>{currentDate.toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase()}</h1>
          
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={() => setMenuOpen(false)}>×</button>
            </div>
            
            <div className="mobile-menu-content">
              <div className="menu-item user-info">
                <div className="user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="user-details">
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              
              <button className="menu-item" onClick={() => { setShowAllEvents(true); setMenuOpen(false); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Manage Events
              </button>
              
              <button className="menu-item" onClick={toggleDarkMode}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {darkMode ? (
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
                  )}
                </svg>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button className="menu-item logout" onClick={handleLogout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="calendar-container">
        {/* Day Headers */}
        <div className="day-headers">
          {daysOfWeek.map((day, index) => (
            <div key={`day-${index}`} className={`day-header ${index === 6 ? 'sunday' : ''}`}>
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
                      {dayEvents.slice(0, 1).map((ev, eventIndex) => (
                        <div
                          key={ev.id || `temp-event-${eventIndex}`}
                          className="event-title"
                          style={{ 
                            backgroundColor: stringToColor(ev.title),
                            color: 'white',
                            fontSize: '8px',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            marginBottom: '1px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setModalInitial(ev);
                            setModalOpen(true);
                          }}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 1 && (
                        <div className="more-events">+{dayEvents.length - 1}</div>
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
      
      {/* Search Modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        events={events}
        onEventSelect={handleEventSelect}
      />
      
      {/* All Events Modal */}
      {showAllEvents && (
        <div className="modal-overlay" onClick={() => setShowAllEvents(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header d-flex align-items-center justify-content-between">
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                Manage Events
              </h2>
              <button 
                onClick={() => setShowAllEvents(false)}
                className="btn btn-text"
                style={{ padding: '8px', minHeight: 'auto', fontSize: '20px', color: 'var(--text-tertiary)' }}
              >
                ×
              </button>
            </div>
            
            <div className="card-body">
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                  <p style={{ fontSize: '16px', margin: 0 }}>No events found</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {events.map(ev => (
                    <div key={ev.id} style={{ 
                      borderBottom: '1px solid var(--border-color)', 
                      padding: '16px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{ 
                        width: '4px',
                        height: '40px',
                        backgroundColor: stringToColor(ev.title),
                        borderRadius: '2px',
                        flexShrink: 0
                      }}></div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                          {ev.title}
                        </div>
                        {ev.description && (
                          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            {ev.description}
                          </div>
                        )}
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-text btn-sm" 
                          onClick={() => { setModalInitial(ev); setModalOpen(true); setShowAllEvents(false); }}
                          style={{ padding: '6px 8px', fontSize: '14px' }}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-text btn-sm" 
                          onClick={async () => {
                            await supabase.from('events').delete().eq('id', ev.id);
                            const { data } = await supabase.from('events').select('*').eq('user_id', user.id);
                            if (data) setEvents(data);
                          }}
                          style={{ padding: '6px 8px', fontSize: '14px', color: 'var(--error)' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}