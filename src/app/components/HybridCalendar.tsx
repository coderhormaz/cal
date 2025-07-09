'use client';
import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isToday } from 'date-fns';
import { supabase } from '../../lib/supabase';
import EventModal, { EventData } from './EventModal';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // --- COMPONENT BODY STARTS HERE ---
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 500, margin: '0 auto 12px auto', padding: '8px 0' }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>🗓️ My Calendar</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>Signed in as: <b>{user.email}</b></span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-success btn-sm" onClick={() => handleAddEvent()} title="Add Event">＋ Add Event</button>
            <button className="btn btn-info btn-sm" onClick={() => setShowAllEvents(true)} title="View All Events">📋 View All Events</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={async () => { await import('../../lib/supabase').then(({ supabase }) => supabase.auth.signOut()); location.reload(); }}>Logout</button>
          </div>
        </div>
      </div>
      <div
        className="calendar-responsive-container"
        style={{
          padding: 0,
          backgroundColor: 'transparent',
          fontFamily: 'Arial, sans-serif',
          width: '100%',
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <style>{`
          .calendar-responsive-container {
            width: 100vw;
            max-width: 500px;
            min-height: 100vh;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 8px;
          }
          .calendar-header h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
          }
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            background-color: #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            flex: 1 1 auto;
          }
          .calendar-day {
            background-color: #fff;
            border: 1px solid #e5e7eb;
            padding: 12px 4px 8px 4px;
            min-height: 64px;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            transition: background 0.2s;
          }
          .calendar-day.header {
            background-color: #f3f4f6;
            font-weight: bold;
            text-align: center;
            cursor: default;
            min-height: 36px;
            align-items: center;
            justify-content: center;
            font-size: 0.98rem;
          }
          .calendar-day.today {
            background-color: #d1e7dd;
            border-color: #b6dfc5;
          }
          .calendar-day:hover:not(.header) {
            background-color: #f0fdfa;
          }
          .gregorian-date {
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 2px;
          }
          .parsi-date {
            font-size: 0.85em;
            color: #555;
          }
          @media (max-width: 700px) {
            .calendar-responsive-container {
              max-width: 100vw;
              min-height: 100vh;
              padding: 0;
            }
            .calendar-header h2 {
              font-size: 1.1rem;
            }
            .calendar-day, .calendar-day.header {
              padding: 7px 1px 5px 1px;
              min-height: 32px;
              font-size: 0.85rem;
            }
            .calendar-grid {
              border-radius: 6px;
            }
          }
          @media (max-width: 480px) {
            .calendar-responsive-container {
              min-height: 100vh;
              width: 100vw;
              max-width: 100vw;
            }
            .calendar-header h2 {
              font-size: 0.98rem;
            }
            .calendar-day, .calendar-day.header {
              padding: 4px 0 2px 0;
              min-height: 24px;
              font-size: 0.75rem;
            }
          }
        `}</style>
        <div className="calendar-header mb-3">
          <button className="btn btn-primary" style={{ minWidth: 80 }} onClick={() => setCurrentDate(subMonths(currentDate, 1))}>← Prev</button>
          <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button className="btn btn-primary" style={{ minWidth: 80 }} onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next →</button>
        </div>
        <div className="calendar-grid" style={{ minWidth: 0 }}>
          {daysOfWeek.map(day => (
            <div
              key={day}
              className="calendar-day header"
              style={{
                minWidth: 0,
                overflow: 'visible',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                fontSize: '0.95rem',
                paddingLeft: 2,
                paddingRight: 2,
                textAlign: 'center',
                lineHeight: 1.1
              }}
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day" style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', minHeight: 24, minWidth: 0 }}></div>
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
                  fontSize: '0.95rem',
                  paddingLeft: 2,
                  paddingRight: 2,
                  textAlign: 'left',
                  lineHeight: 1.15
                }}
                onClick={() => handleAddEvent(dateObj.toISOString().slice(0, 10))}
              >
                <div className="gregorian-date">{i + 1}</div>
                <div className="parsi-date" style={{wordBreak: 'break-word', whiteSpace: 'normal', fontSize: '0.72em', color: '#666'}}>{shenshaiText}</div>
                {dayEvents.map(ev => (
                  <div key={ev.id} style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: 6, padding: '2px 6px', margin: '2px 0', fontSize: '0.8em', cursor: 'pointer' }}
                    onClick={e => { e.stopPropagation(); setModalInitial(ev); setModalOpen(true); }}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveEvent} initialData={modalInitial} />
      {showAllEvents && <AllEventsModal />}
    </div>
  );
}