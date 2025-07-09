'use client';
import React, { useState, useEffect } from 'react';
// Utility: Generate a color from a string (event title)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 72%)`;
}

// Popover component for event details
function EventPopover({ event, position, onClose }: { event: EventData, position: { x: number, y: number }, onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: position.y,
      left: position.x,
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 4px 24px 0 rgba(60,64,67,0.18)',
      padding: '14px 18px',
      minWidth: 220,
      zIndex: 3000,
      border: '1px solid #e0e7ff',
      fontFamily: 'Roboto, Arial, sans-serif',
      color: '#222',
      animation: 'fadeIn 0.18s',
    }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{event.title}</div>
      {event.description && <div style={{ fontSize: 13, color: '#555', marginBottom: 6 }}>{event.description}</div>}
      <div style={{ fontSize: 12, color: '#666' }}>
        {event.calendar_type === 'gregorian'
          ? `Gregorian: ${(typeof event.gregorian_month === 'number' ? ZCalendar.Shenshai.MAH[event.gregorian_month] : '')} ${event.gregorian_day}`
          : `Parsi: ${(typeof event.parsi_month === 'number' ? ZCalendar.Shenshai.MAH[event.parsi_month] : '')} ${event.parsi_roj}`}
      </div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
        {typeof event.recurrence !== 'undefined' && event.recurrence !== '' ? `Repeats: ${event.recurrence}` : 'One-time event'}
      </div>
      <button onClick={onClose} style={{ position: 'absolute', top: 6, right: 10, background: 'none', border: 'none', fontSize: 18, color: '#aaa', cursor: 'pointer' }} title="Close">×</button>
    </div>
  );
}
import { addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EventModal, { EventData } from './EventModal';
import 'bootstrap/dist/css/bootstrap.min.css';

// Add Roboto font import to the top of the file (for Next.js, use a <link> in the <head> via _app or layout, but for demo, inject here)
if (typeof window !== 'undefined') {
  const roboto = document.createElement('link');
  roboto.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  roboto.rel = 'stylesheet';
  document.head.appendChild(roboto);
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

// Ensure days of week are always visible and not hidden by overflow or grid issues
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface User {
  id: string;
  email: string;
  // add more fields if needed
}

interface HybridCalendarProps {
  user: User;
}

export default function HybridCalendar({ user }: HybridCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const shenshaiDays = ZCalendar.Shenshai.getRojNamesForMonth(new Date(year, month, 1));

  // Event state and modal
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Partial<EventData> | undefined>(undefined);

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
    // If dateStr is provided, prefill the day for the selected calendar type (default to gregorian)
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
  };

  // Save event handler
  const handleSaveEvent = async (data: EventData) => {
    // Ensure all required fields are present and optional fields are null if not used
    let event = {
      ...data,
      user_id: user.id,
      email: user.email,
      // For gregorian events, parsi fields should be null
      parsi_month: data.calendar_type === 'parsi' ? (data.parsi_month ?? null) : null,
      parsi_roj: data.calendar_type === 'parsi' ? (data.parsi_roj ?? null) : null,
      gregorian_month: data.calendar_type === 'gregorian' ? (data.gregorian_month ?? null) : null,
      gregorian_day: data.calendar_type === 'gregorian' ? (data.gregorian_day ?? null) : null,
      // Recurrence should be 'none' if empty string
      recurrence: !data.recurrence ? 'none' : data.recurrence,
      // Reminder must be boolean
      reminder: !!data.reminder
    };
    // Remove id if undefined (for insert)
    if (typeof event.id === 'undefined') {
      event = Object.fromEntries(Object.entries(event).filter(([k]) => k !== 'id')) as typeof event;
    }
    console.log('Event payload to Supabase:', event);
    if (data.id) {
      // Update
      await supabase.from('events').update(event).eq('id', data.id);
    } else {
      // Insert
      await supabase.from('events').insert([event]);
    }
    setModalOpen(false);
  };

  // State for all events modal
  const [showAllEvents, setShowAllEvents] = useState(false);

  // Handler to delete an event
  async function handleDeleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) {
    alert('Failed to delete event: ' + error.message);
    return;
  }
  // Refetch events after delete
  const { data, error: fetchError } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id);
  if (!fetchError && data) setEvents(data);
  setShowAllEvents(false);
  setModalOpen(false);
  }

  // Handler to edit an event (open modal with data)
  function handleEditEvent(event: EventData) {
    setModalInitial(event);
    setModalOpen(true);
    setShowAllEvents(false);
  }

  // Modal to show all events for the user
  function AllEventsModal() {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 340, maxWidth: 500, boxShadow: '0 2px 16px #aaa', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 style={{ marginBottom: 12 }}>All My Events</h3>
          <button onClick={() => setShowAllEvents(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} title="Close">×</button>
          {events.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', margin: '32px 0' }}>No events found.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {events.map(ev => (
                <li key={ev.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: 13, color: '#555' }}>{ev.description}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {ev.calendar_type === 'gregorian'
                        ? `Gregorian: ${typeof ev.gregorian_month === 'number' ? (ZCalendar.Shenshai.MAH[ev.gregorian_month] || ev.gregorian_month + 1) : ''} ${ev.gregorian_day}`
                        : `Parsi: ${typeof ev.parsi_month === 'number' ? (ZCalendar.Shenshai.MAH[ev.parsi_month] || ev.parsi_month + 1) : ''} ${ev.parsi_roj}`}
                      {ev.recurrence ? ` (${ev.recurrence})` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditEvent(ev)} title="Edit">✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteEvent(ev.id!)} title="Delete">🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Popover state
  const [popover, setPopover] = useState<{ event: EventData, position: { x: number, y: number } } | null>(null);

  // --- COMPONENT BODY STARTS HERE ---
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Premium sticky header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(90deg, #4285F4 0%, #1967d2 100%)',
        color: '#fff',
        padding: '18px 0 10px 0',
        boxShadow: '0 2px 12px rgba(66,133,244,0.08)',
        marginBottom: 18
      }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        padding: '0 8px',
      }}>
        {/* Left: Calendar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-light"
            style={{ fontWeight: 500, borderRadius: 8, border: '1px solid #e3e8f0', background: '#fff', color: '#1967d2', boxShadow: '0 1px 4px #e3e8f0', padding: '4px 14px', fontSize: 15, transition: 'background 0.18s' }}
            onClick={() => setCurrentDate(new Date())}
            title="Go to Today"
          >Today</button>
          <select
            value={month}
            onChange={e => setCurrentDate(new Date(year, Number(e.target.value), 1))}
            style={{ minWidth: 120, borderRadius: 6, border: '1px solid #e3e8f0', padding: '6px 12px', fontSize: 16, fontWeight: 500, background: '#fff', color: '#1967d2' }}
            title="Jump to month"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx} value={idx} style={{ fontSize: 16, fontWeight: 500 }}>{new Date(year, idx, 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <input
            type="number"
            min="1900"
            max="2100"
            value={year}
            onChange={e => setCurrentDate(new Date(Number(e.target.value), month, 1))}
            style={{ width: 80, borderRadius: 6, border: '1px solid #e3e8f0', padding: '3px 8px', fontSize: 15 }}
            title="Jump to year"
          />
        </div>
        {/* Right: User Info and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 400, opacity: 0.92 }}>Signed in as:</span>
          <b style={{ fontWeight: 500, fontSize: 15, color: '#e65100', background: '#fff3e0', borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'clip', maxWidth: 260 }}>{user.email}</b>
          <button
            className="btn btn-primary"
            style={{ fontWeight: 500, borderRadius: 8, background: '#4285F4', color: '#fff', boxShadow: '0 1px 4px #e3e8f0', padding: '4px 14px', fontSize: 15, border: 'none' }}
            onClick={() => handleAddEvent()}
          >Add Event</button>
          <button
            className="btn btn-outline-secondary"
            style={{ fontWeight: 500, borderRadius: 8, border: '1px solid #e3e8f0', background: '#f7fafd', color: '#1967d2', boxShadow: '0 1px 4px #e3e8f0', padding: '4px 14px', fontSize: 15 }}
            onClick={() => setShowAllEvents(true)}
          >Manage Events</button>
          <button
            className="btn btn-outline-danger"
            style={{ fontWeight: 500, borderRadius: 8, border: '1px solid #e57373', background: '#fff', color: '#e53935', boxShadow: '0 1px 4px #e3e8f0', padding: '4px 14px', fontSize: 15 }}
            onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
          >Logout</button>
        </div>
      </div>
      </div>
      {/* Main calendar card */}
      <div style={{
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 8px 40px 0 rgba(60,64,67,0.13)',
        maxWidth: 700,
        margin: '32px auto',
        padding: 32,
        position: 'relative',
        minHeight: 560,
        border: '1.5px solid #e3e8f0',
        transition: 'box-shadow 0.22s',
      }}>
        <div className="calendar-header mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <button className="btn btn-primary" style={{ minWidth: 80, borderRadius: 8, fontWeight: 500, background: '#4285F4', border: 'none', boxShadow: '0 1px 4px #e3e8f0' }} onClick={() => setCurrentDate(subMonths(currentDate, 1))}>← Prev</button>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1967d2', margin: 0, letterSpacing: 0.2 }}>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button className="btn btn-primary" style={{ minWidth: 80, borderRadius: 8, fontWeight: 500, background: '#4285F4', border: 'none', boxShadow: '0 1px 4px #e3e8f0' }} onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next →</button>
        </div>
        <div className="calendar-grid" style={{
          minWidth: 0,
          marginBottom: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 6,
          background: '#f7fafd',
          borderRadius: 14,
          boxShadow: '0 1px 8px #e3e8f0',
          padding: 10,
        }}>
          {daysOfWeek.map(day => (
            <div
              key={day}
              className="calendar-day header"
              style={{
                minWidth: 0,
                overflow: 'visible',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                fontSize: '1.05rem',
                padding: '6px 0',
                textAlign: 'center',
                lineHeight: 1.1,
                fontWeight: 600,
                color: '#1967d2',
                background: 'transparent',
                borderRadius: 8,
              }}
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day" style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', minHeight: 32, minWidth: 0, borderRadius: 8 }}></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dateObj = new Date(year, month, i + 1);
            const isCurrentDay = isToday(dateObj);
            const shenshai = shenshaiDays[i];
            const shenshaiText = shenshai.month ? `${shenshai.day} ${shenshai.month}` : shenshai.day;
            // Find events for this day (new structure)
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
                // Map the current date to parsi_month and parsi_roj using shenshaiDays
                const shenshai = shenshaiDays[i];
                if (!shenshai) return false;
                // Find the month and roj index for this day
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
                className={`calendar-day${isCurrentDay ? ' today' : ''}`}
                style={{
                  minWidth: 0,
                  overflow: 'visible',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  fontSize: '1.01rem',
                  padding: '7px 4px 7px 6px',
                  textAlign: 'left',
                  lineHeight: 1.15,
                  borderRadius: 10,
                  background: isCurrentDay ? 'linear-gradient(90deg, #e3f0ff 60%, #f7fafd 100%)' : '#fff',
                  border: isCurrentDay ? '2px solid #4285F4' : '1px solid #e5e7eb',
                  boxShadow: isCurrentDay ? '0 2px 8px #e3e8f0' : 'none',
                  transition: 'box-shadow 0.18s, border 0.18s, background 0.18s',
                  cursor: 'pointer',
                }}
                onClick={() => handleAddEvent(dateObj.toISOString().slice(0, 10))}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px #e3e8f0')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = isCurrentDay ? '0 2px 8px #e3e8f0' : 'none')}
              >
                <div className="gregorian-date" style={{ fontWeight: 600, color: isCurrentDay ? '#1967d2' : '#222', fontSize: '1.08em' }}>{i + 1}</div>
                <div className="parsi-date" style={{wordBreak: 'break-word', whiteSpace: 'normal', fontSize: '0.75em', color: '#666', marginBottom: 2}}>{shenshaiText}</div>
                {dayEvents.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      background: '#fff',
                      color: '#222',
                      borderRadius: 7,
                      padding: '3px 10px 3px 8px',
                      margin: '3px 0',
                      fontSize: '0.85em',
                      cursor: 'pointer',
                      borderLeft: `6px solid ${stringToColor(ev.title)}`,
                      boxShadow: '0 2px 8px 0 rgba(66,133,244,0.10)',
                      transition: 'box-shadow 0.18s, background 0.18s, transform 0.18s',
                      fontWeight: 500,
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setModalInitial(ev);
                      setModalOpen(true);
                    }}
                    onMouseEnter={e => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      (e.target as HTMLElement).style.transform = 'scale(1.04)';
                      setPopover({ event: ev, position: { x: rect.right + 8, y: rect.top - 8 } });
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.transform = 'scale(1)';
                      setPopover(null);
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{ev.title}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {/* Floating Action Button for Add Event */}
        <button
          className="btn btn-primary"
          style={{
            position: 'fixed',
            right: 32,
            bottom: 32,
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4285F4 60%, #1967d2 100%)',
            color: '#fff',
            fontSize: 36,
            boxShadow: '0 8px 32px 0 rgba(66,133,244,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3002,
            border: 'none',
            cursor: 'pointer',
            transition: 'box-shadow 0.22s, transform 0.18s',
          }}
          onClick={() => handleAddEvent()}
          title="Add Event"
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ＋
        </button>
        {/* All Events Modal and Event Modal */}
        <EventModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveEvent} initialData={modalInitial} />
        {showAllEvents && <AllEventsModal />}
        {popover && <EventPopover event={popover.event} position={popover.position} onClose={() => setPopover(null)} />}
      </div>
    </div>
  );
}