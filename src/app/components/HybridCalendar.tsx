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

// Popover component for event details
function EventPopover({ event, position, onClose }: { event: EventData, position: { x: number, y: number }, onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: position.y,
      left: position.x,
      background: 'var(--surface)',
      borderRadius: 'var(--border-radius-large)',
      boxShadow: 'var(--shadow-heavy)',
      padding: '16px 20px',
      minWidth: '240px',
      maxWidth: '320px',
      zIndex: 3000,
      border: '1px solid var(--border-color)',
      fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
      color: 'var(--text-primary)',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {event.title}
      </div>
      {event.description && (
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
          {event.description}
        </div>
      )}
      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
        {event.calendar_type === 'gregorian'
          ? `Gregorian: ${(typeof event.gregorian_month === 'number' ? ZCalendar.Shenshai.MAH[event.gregorian_month] : '')} ${event.gregorian_day}`
          : `Parsi: ${(typeof event.parsi_month === 'number' ? ZCalendar.Shenshai.MAH[event.parsi_month] : '')} ${event.parsi_roj}`}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
        {typeof event.recurrence !== 'undefined' && event.recurrence !== '' ? `Repeats: ${event.recurrence}` : 'One-time event'}
      </div>
      <button 
        onClick={onClose} 
        style={{ 
          position: 'absolute', 
          top: '8px', 
          right: '12px', 
          background: 'none', 
          border: 'none', 
          fontSize: '20px', 
          color: 'var(--text-tertiary)', 
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          transition: 'var(--transition)'
        }} 
        title="Close"
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-variant)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        ×
      </button>
    </div>
  );
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

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface User {
  id: string;
  email: string;
}

interface HybridCalendarProps {
  user: User;
}

export default function HybridCalendar({ user }: HybridCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const shenshaiDays = ZCalendar.Shenshai.getRojNamesForMonth(new Date(year, month, 1));

  // Event state and modal
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Partial<EventData> | undefined>(undefined);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [popover, setPopover] = useState<{ event: EventData, position: { x: number, y: number } } | null>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch events for this user and month
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

  // Add event button handler
  const handleAddEvent = (dateStr?: string) => {
    if (dateStr) {
      const date = new Date(dateStr);
      setModalInitial({
        calendar_type: 'gregorian',
        gregorian_month: date.getMonth(),
        gregorian_day: date.getDate(),
      });
    } else {
      setModalInitial(undefined);
    }
    setModalOpen(true);
    setSidebarOpen(false);
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

  // Handler to delete an event
  async function handleDeleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      alert('Failed to delete event: ' + error.message);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id);
    if (!fetchError && data) setEvents(data);
    setShowAllEvents(false);
    setModalOpen(false);
  }

  // Handler to edit an event
  function handleEditEvent(event: EventData) {
    setModalInitial(event);
    setModalOpen(true);
    setShowAllEvents(false);
  }

  // Modal to show all events for the user
  function AllEventsModal() {
    return (
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
              title="Close"
            >
              ×
            </button>
          </div>
          
          <div className="card-body">
            {events.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <p style={{ fontSize: '16px', margin: 0 }}>No events found</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Create your first event to get started</p>
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
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {ev.title}
                      </div>
                      {ev.description && (
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                          {ev.description}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {ev.calendar_type === 'gregorian'
                          ? `Gregorian: ${typeof ev.gregorian_month === 'number' ? (ZCalendar.Shenshai.MAH[ev.gregorian_month] || ev.gregorian_month + 1) : ''} ${ev.gregorian_day}`
                          : `Parsi: ${typeof ev.parsi_month === 'number' ? (ZCalendar.Shenshai.MAH[ev.parsi_month] || ev.parsi_month + 1) : ''} ${ev.parsi_roj}`}
                        {ev.recurrence && ev.recurrence !== 'none' ? ` • Repeats ${ev.recurrence}` : ''}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-text btn-sm" 
                        onClick={() => handleEditEvent(ev)} 
                        title="Edit event"
                        style={{ padding: '6px 8px', fontSize: '14px' }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-text btn-sm" 
                        onClick={() => handleDeleteEvent(ev.id!)} 
                        title="Delete event"
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
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--surface-variant)',
      fontFamily: 'Google Sans, Roboto, Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-light)'
      }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between" style={{ 
            padding: isMobile ? '12px 0' : '16px 0',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Left side - Logo and navigation */}
            <div className="d-flex align-items-center gap-3">
              {isMobile && (
                <button
                  className="btn btn-text"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{ padding: '8px', fontSize: '20px' }}
                  title="Menu"
                >
                  ☰
                </button>
              )}
              
              <div className="d-flex align-items-center gap-3">
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: 'var(--primary-blue)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: 'white'
                }}>
                  📅
                </div>
                <h1 style={{ 
                  fontSize: isMobile ? '18px' : '22px', 
                  fontWeight: '400', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  Calendar
                </h1>
              </div>
            </div>

            {/* Right side - User info and actions */}
            <div className="d-flex align-items-center gap-2" style={{ flexWrap: 'wrap' }}>
              {!isMobile && (
                <>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {user.email}
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddEvent()}
                    style={{ fontSize: '14px' }}
                  >
                    + Create
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowAllEvents(true)}
                    style={{ fontSize: '14px' }}
                  >
                    Manage
                  </button>
                </>
              )}
              
              <button
                className="btn btn-text"
                onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
                style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
                title="Sign out"
              >
                {isMobile ? '⏻' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 200
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow-heavy)',
              padding: '20px',
              animation: 'slideInLeft 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Menu</h2>
              <button
                className="btn btn-text"
                onClick={() => setSidebarOpen(false)}
                style={{ padding: '8px', fontSize: '20px' }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleAddEvent()}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                + Create Event
              </button>
              
              <button
                className="btn btn-outline"
                onClick={() => setShowAllEvents(true)}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Manage Events
              </button>
              
              <div style={{ 
                padding: '12px 0', 
                borderTop: '1px solid var(--border-color)',
                marginTop: '12px'
              }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Signed in as:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container" style={{ padding: isMobile ? '16px 12px' : '24px 16px' }}>
        {/* Calendar Controls */}
        <div className="card mb-4">
          <div className="card-body" style={{ padding: isMobile ? '16px' : '20px' }}>
            <div className="d-flex align-items-center justify-content-between gap-3" style={{ flexWrap: 'wrap' }}>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-text"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  style={{ fontSize: '18px', padding: '8px 12px' }}
                  title="Previous month"
                >
                  ‹
                </button>
                
                <h2 style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  fontWeight: '400', 
                  color: 'var(--text-primary)',
                  margin: '0 8px',
                  minWidth: isMobile ? '180px' : '220px',
                  textAlign: 'center'
                }}>
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                
                <button
                  className="btn btn-text"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  style={{ fontSize: '18px', padding: '8px 12px' }}
                  title="Next month"
                >
                  ›
                </button>
              </div>
              
              <button
                className="btn btn-outline"
                onClick={() => setCurrentDate(new Date())}
                style={{ fontSize: '14px' }}
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="card">
          <div className="card-body" style={{ padding: isMobile ? '12px' : '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: isMobile ? '1px' : '2px',
              marginBottom: '8px'
            }}>
              {/* Day headers */}
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  style={{
                    padding: isMobile ? '8px 4px' : '12px 8px',
                    textAlign: 'center',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface-variant)',
                    borderRadius: 'var(--border-radius)'
                  }}
                >
                  {isMobile ? day.slice(0, 1) : day}
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: isMobile ? '1px' : '2px'
            }}>
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} style={{ 
                  minHeight: isMobile ? '60px' : '80px',
                  backgroundColor: 'var(--surface-variant)',
                  borderRadius: 'var(--border-radius)'
                }}></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dateObj = new Date(year, month, i + 1);
                const isCurrentDay = isToday(dateObj);
                const shenshai = shenshaiDays[i];
                const shenshaiText = shenshai.month ? `${shenshai.day} ${shenshai.month}` : shenshai.day;
                
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
                    style={{
                      minHeight: isMobile ? '60px' : '80px',
                      padding: isMobile ? '6px 4px' : '8px 6px',
                      backgroundColor: isCurrentDay ? 'var(--secondary-blue)' : 'var(--surface)',
                      border: isCurrentDay ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleAddEvent(dateObj.toISOString().slice(0, 10))}
                    onMouseEnter={e => {
                      if (!isCurrentDay) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-variant)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isCurrentDay) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface)';
                      }
                    }}
                  >
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: isMobile ? '14px' : '16px',
                      color: isCurrentDay ? 'var(--primary-blue)' : 'var(--text-primary)',
                      marginBottom: '2px'
                    }}>
                      {i + 1}
                    </div>
                    
                    {!isMobile && (
                      <div style={{
                        fontSize: '10px',
                        color: 'var(--text-tertiary)',
                        lineHeight: '1.2',
                        marginBottom: '4px',
                        wordBreak: 'break-word'
                      }}>
                        {shenshaiText}
                      </div>
                    )}

                    {/* Events */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvents.slice(0, isMobile ? 2 : 3).map(ev => (
                        <div
                          key={ev.id}
                          style={{
                            backgroundColor: stringToColor(ev.title),
                            color: 'white',
                            borderRadius: '4px',
                            padding: isMobile ? '2px 4px' : '3px 6px',
                            fontSize: isMobile ? '10px' : '11px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            if (isMobile) {
                              setModalInitial(ev);
                              setModalOpen(true);
                            }
                          }}
                          onMouseEnter={e => {
                            if (!isMobile) {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setPopover({ 
                                event: ev, 
                                position: { 
                                  x: Math.min(rect.right + 8, window.innerWidth - 320), 
                                  y: rect.top 
                                } 
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isMobile) {
                              setPopover(null);
                            }
                          }}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                      
                      {dayEvents.length > (isMobile ? 2 : 3) && (
                        <div style={{
                          fontSize: isMobile ? '9px' : '10px',
                          color: 'var(--text-tertiary)',
                          fontWeight: '500'
                        }}>
                          +{dayEvents.length - (isMobile ? 2 : 3)} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      {isMobile && (
        <button
          className="btn btn-primary"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            fontSize: '24px',
            boxShadow: 'var(--shadow-heavy)',
            zIndex: 150
          }}
          onClick={() => handleAddEvent()}
          title="Create event"
        >
          +
        </button>
      )}

      {/* Modals and Popovers */}
      <EventModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveEvent} 
        initialData={modalInitial} 
      />
      
      {showAllEvents && <AllEventsModal />}
      
      {popover && !isMobile && (
        <EventPopover 
          event={popover.event} 
          position={popover.position} 
          onClose={() => setPopover(null)} 
        />
      )}
    </div>
  );
}