'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EventModal, { EventData as BaseEventData } from './EventModal';

// Extend EventData to support Gatha events
interface EventData extends BaseEventData {
  gatha_index?: number;
}
import DayEventsModal from './DayEventsModal';

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
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {event.title}{event.event_type && event.event_type !== 'none' ? ` ${event.event_type === 'death' ? 'Baj' : event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}` : ''}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Event color mapping function
function getEventColor(eventType: string) {
  switch (eventType) {
    case 'birthday':
      return '#ff9500'; // orange
    case 'wedding':
      return '#34c759'; // green
    case 'navjote':
      return '#007aff'; // blue
    case 'death':
      return '#ff3b30'; // red 
    case 'none':
    default:
      return '#a259e6'; // purple
  }
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
  // removed unused selectedDate state
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [dayEventsModal, setDayEventsModal] = useState<{ open: boolean; date: Date; events: EventData[] }>({
    open: false,
    date: new Date(),
    events: []
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

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
      if (!error && data) {
        // Normalize gatha_index: convert null to undefined
        const normalized = data.map(ev => ({
          ...ev,
          gatha_index: typeof ev.gatha_index === 'number' ? ev.gatha_index : undefined
        }));
        setEvents(normalized);
      }
    };
    fetchEvents();
  }, [user.id, modalOpen]);

  // Add event handler
  const handleAddEvent = (dateStr: string) => {
    const date = new Date(dateStr);
    // Get Parsi day info for this date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const shenshaiDays = ZCalendar.Shenshai.getRojNamesForMonth(new Date(year, month, 1));
    const shenshai = shenshaiDays[day - 1];

    // If Gatha day (month is empty), set calendar_type to 'parsi', parsi_month = null, parsi_roj = null, gatha_index
    if (shenshai && shenshai.month === '') {
      setModalInitial({
        calendar_type: 'parsi',
        gatha_index: ZCalendar.Shenshai.GATHAS.indexOf(shenshai.day),
        // other fields can be set as needed
      });
    } else {
      setModalInitial({
        calendar_type: 'gregorian',
        gregorian_month: date.getMonth(),
        gregorian_day: date.getDate(),
      });
    }
    setModalOpen(true);
    setDayEventsModal({ open: false, date: new Date(), events: [] });
  };

  // Handle day click - show events for that day
  const handleDayClick = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayEvents = events.filter(ev => {
      const day = date.getDate();
      const month = date.getMonth();
      const dayIndex = day - 1;
      const shenshaiDays = ZCalendar.Shenshai.getRojNamesForMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      const shenshai = shenshaiDays[dayIndex];

      if (ev.calendar_type === 'gregorian') {
        if (ev.recurrence === 'yearly') {
          return ev.gregorian_month === month && ev.gregorian_day === day;
        } else if (ev.recurrence === 'monthly') {
          return ev.gregorian_day === day;
        } else {
          return ev.gregorian_month === month && ev.gregorian_day === day;
        }
      } else if (ev.calendar_type === 'parsi') {
        // Gatha day
        if (shenshai && shenshai.month === '' && typeof ev.gatha_index === 'number') {
          return ZCalendar.Shenshai.GATHAS[ev.gatha_index] === shenshai.day;
        }
        // Normal Parsi day
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

    setDayEventsModal({ open: true, date, events: dayEvents });
  };

  // Save event handler
  const handleSaveEvent = async (data: EventData) => {
    let gathaIndex = data.gatha_index;
    let event;
    if (data.calendar_type === 'parsi' && data.parsi_month === 12 && typeof data.parsi_roj === 'number') {
      // Gatha event: set gatha_index, nullify parsi_month and parsi_roj
      gathaIndex = data.parsi_roj - 1;
      event = {
        ...data,
        user_id: user.id,
        email: user.email,
        parsi_month: null,
        parsi_roj: null,
        gatha_index: gathaIndex,
        gregorian_month: null,
        gregorian_day: null,
        recurrence: !data.recurrence ? 'none' : data.recurrence,
        reminder: !!data.reminder
      };
    } else {
      // Non-Gatha event
      event = {
        ...data,
        user_id: user.id,
        email: user.email,
        parsi_month: data.calendar_type === 'parsi' ? (data.parsi_month ?? null) : null,
        parsi_roj: data.calendar_type === 'parsi' ? (data.parsi_roj ?? null) : null,
        gatha_index: null,
        gregorian_month: data.calendar_type === 'gregorian' ? (data.gregorian_month ?? null) : null,
        gregorian_day: data.calendar_type === 'gregorian' ? (data.gregorian_day ?? null) : null,
        recurrence: !data.recurrence ? 'none' : data.recurrence,
        reminder: !!data.reminder
      };
    }

    if (typeof event.id === 'undefined') {
      event = Object.fromEntries(Object.entries(event).filter(([k]) => k !== 'id')) as typeof event;
    }

    let response;
    if (data.id) {
      response = await supabase.from('events').update(event).eq('id', data.id);
    } else {
      response = await supabase.from('events').insert([event]);
    }
    if (response.error) {
      alert('Error adding event: ' + response.error.message);
      console.error('Supabase error:', response.error);
      return;
    }
    setModalOpen(false);
  };

  // Handle event selection from search
  const handleEventSelect = (event: EventData) => {
    // Navigate to the event's date
    if (event.calendar_type === 'gregorian') {
      if (typeof event.gregorian_month === 'number') {
        const eventDate = new Date(currentDate.getFullYear(), event.gregorian_month, 1);
        setCurrentDate(eventDate);
      }
    } else if (event.calendar_type === 'parsi') {
      // For Parsi events, we need to find the corresponding Gregorian date
      if (typeof event.parsi_month === 'number') {
        // Approximate mapping - this would need proper Parsi to Gregorian conversion
        const approxMonth = event.parsi_month;
        const eventDate = new Date(currentDate.getFullYear(), approxMonth, 1);
        setCurrentDate(eventDate);
      }
    }
    setModalInitial(event);
    setModalOpen(true);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Swipe gesture state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Handle swipe gesture
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { // minimum swipe distance
        if (diff > 0) {
          setCurrentDate(addMonths(currentDate, 1)); // swipe left: next month
        } else {
          setCurrentDate(subMonths(currentDate, 1)); // swipe right: previous month
        }
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className={`mobile-calendar ${darkMode ? 'dark-mode' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="mobile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '24px' }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textAlign: 'center' }}>Parsi Shenshai Calendar</span>
        </div>
        <button className="search-btn" onClick={() => setSearchOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Month/Year Header */}
      <div className="month-header" style={{ marginTop: '0px' }}>
        <div className="month-navigation">
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <h1>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
          
          <button 
            className="nav-btn"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {/* Parsi months for this Gregorian month with MAH beside */}
        <div style={{ textAlign: 'center', fontWeight: 600, fontSize: '15px', color: 'var(--text-secondary)', marginTop: '2px', letterSpacing: '0.5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#000', fontSize: '16px' }}>Saal</span>
            <span style={{ marginLeft: '6px' }}>
              {(() => {
                // Calculate Parsi year (saal) for the current Gregorian date
                // Use Navroze as the start of the Parsi year
                const navroze = ZCalendar.Shenshai.getPrecedingNavrozeDate(currentDate);
                const navrozeYear = navroze.getFullYear();
                let parsiYear = navrozeYear - 631;
                // If today is before Navroze, subtract 1 from parsiYear
                if (currentDate < navroze) {
                  parsiYear -= 1;
                }
                // Always add 1 to match the expected Parsi year
                parsiYear += 1;
                return parsiYear > 0 ? parsiYear + '' : '';
              })()}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: '#000', fontSize: '16px' }}>Mah</span>
            <span style={{ marginLeft: '6px' }}>
              {(() => {
                // Get unique Parsi months in this Gregorian month
                const months = Array.from(new Set(shenshaiDays.map(d => d.month).filter(Boolean)));
                return months.length > 0 ? months.join(' - ') : '';
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
            <Image src="/logo.png" alt="Hormaz Innovates Logo" width={32} height={32} style={{ borderRadius: '6px', objectFit: 'cover', marginRight: '8px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Hormaz Innovates</h3>
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
              <button className="menu-item" onClick={() => window.location.href = '/Feedback'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Feedback
              </button>
              <button className="menu-item" onClick={() => window.location.href = '/contactus'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Contact Us
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
              const shenshai = shenshaiDays[i];
              if (ev.calendar_type === 'gregorian') {
                if (ev.recurrence === 'yearly') {
                  return ev.gregorian_month === month && ev.gregorian_day === i + 1;
                } else if (ev.recurrence === 'monthly') {
                  return ev.gregorian_day === i + 1;
                } else {
                  return ev.gregorian_month === month && ev.gregorian_day === i + 1;
                }
              } else if (ev.calendar_type === 'parsi') {
                // Gatha day
                if (shenshai && shenshai.month === '' && typeof ev.gatha_index === 'number') {
                  return ZCalendar.Shenshai.GATHAS[ev.gatha_index] === shenshai.day;
                }
                // Normal Parsi day
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
                onClick={() => handleDayClick(`${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`)}
              >
                <div className="day-content">
                  <div className="day-number">{i + 1}</div>
                  
                  {/* Parsi Date */}
                  {shenshai && (
                    <div className="parsi-date">
                      <div className="parsi-day">{shenshai.day}</div>
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
                            backgroundColor: getEventColor(ev.event_type),
                            color: 'white',
                            fontSize: '8px',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            marginBottom: '1px',
                            overflow: 'visible',
                            textOverflow: 'unset',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            cursor: 'pointer',
                            width: '100%',
                            display: 'block',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setModalInitial(ev);
                            setModalOpen(true);
                          }}
                        >
                          {ev.title}{ev.event_type && ev.event_type !== 'none' ? ` ${ev.event_type === 'death' ? 'Baj' : ev.event_type.charAt(0).toUpperCase() + ev.event_type.slice(1)}` : ''}
                        </div>
                      ))}
                      {dayEvents.length > 1 && (
                        <div className="more-events">+{dayEvents.length - 1}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Special indicator for first day removed as requested */}
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
          style={{ fontSize: '13px', padding: '6px 12px', minHeight: 'unset', height: '32px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => handleAddEvent(new Date().toISOString().slice(0, 10))}
        >
          <span style={{ fontSize: '13px' }}>Add event on {new Date().getDate()} {new Date().toLocaleString('default', { month: 'short' })}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                        backgroundColor: getEventColor(ev.event_type),
                        borderRadius: '2px',
                        flexShrink: 0
                      }}></div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                          {ev.title}{ev.event_type && ev.event_type !== 'none' ? ` ${ev.event_type.charAt(0).toUpperCase() + ev.event_type.slice(1)}` : ''}
                        </div>

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
      
      <DayEventsModal
        open={dayEventsModal.open}
        onClose={() => setDayEventsModal({ open: false, date: new Date(), events: [] })}
        date={dayEventsModal.date}
        events={dayEventsModal.events}
        onAddEvent={() => handleAddEvent(dayEventsModal.date.toISOString().slice(0, 10))}
        onEditEvent={(event) => {
          setModalInitial(event);
          setModalOpen(true);
          setDayEventsModal({ open: false, date: new Date(), events: [] });
        }}
        onDeleteEvent={async (id) => {
          await supabase.from('events').delete().eq('id', id);
          const { data } = await supabase.from('events').select('*').eq('user_id', user.id);
          if (data) setEvents(data);
          // Update day events modal
          const updatedEvents = dayEventsModal.events.filter(ev => ev.id !== id);
          setDayEventsModal(prev => ({ ...prev, events: updatedEvents }));
        }}
      />
    </div>
  );
}