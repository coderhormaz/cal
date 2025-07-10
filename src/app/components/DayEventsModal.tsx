import React from 'react';
import { EventData } from './EventModal';

// Utility: Generate a color from a string (event title)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 55%)`;
}

interface DayEventsModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  events: EventData[];
  onAddEvent: () => void;
  onEditEvent: (event: EventData) => void;
  onDeleteEvent: (id: string) => void;
}

export default function DayEventsModal({
  open,
  onClose,
  date,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}: DayEventsModalProps) {
  if (!open) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="card-header d-flex align-items-center justify-content-between">
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {formatDate(date)}
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              margin: '4px 0 0 0'
            }}>
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-text"
            style={{ 
              padding: '8px',
              minHeight: 'auto',
              fontSize: '20px',
              color: 'var(--text-tertiary)'
            }}
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
              <p style={{ fontSize: '16px', margin: '0 0 16px 0' }}>No events on this day</p>
              <button 
                onClick={onAddEvent}
                className="btn btn-primary"
                style={{ fontSize: '14px' }}
              >
                Add Event
              </button>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {events.map(event => (
                  <div key={event.id} style={{ 
                    borderBottom: '1px solid var(--border-color)', 
                    padding: '16px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{ 
                      width: '4px',
                      height: '40px',
                      backgroundColor: stringToColor(event.title),
                      borderRadius: '2px',
                      flexShrink: 0
                    }}></div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '16px', 
                        marginBottom: '4px', 
                        color: 'var(--text-primary)' 
                      }}>
                        {event.title}
                      </div>
                      {event.description && (
                        <div style={{ 
                          fontSize: '14px', 
                          color: 'var(--text-secondary)', 
                          marginBottom: '8px', 
                          lineHeight: '1.4' 
                        }}>
                          {event.description}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                        {event.calendar_type === 'gregorian' ? 'Gregorian' : 'Parsi'} Calendar
                        {event.recurrence && event.recurrence !== 'none' ? ` • Repeats ${event.recurrence}` : ''}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-text btn-sm" 
                        onClick={() => onEditEvent(event)} 
                        title="Edit event"
                        style={{ padding: '6px 8px', fontSize: '14px' }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-text btn-sm" 
                        onClick={() => onDeleteEvent(event.id!)} 
                        title="Delete event"
                        style={{ padding: '6px 8px', fontSize: '14px', color: 'var(--error)' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={onAddEvent}
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '14px' }}
              >
                Add Another Event
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}