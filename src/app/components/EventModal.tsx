import React, { useState } from 'react';

export interface EventData {
  id?: string;
  title: string;
  event_type: 'none' | 'birthday' | 'wedding' | 'navjote' | 'death';
  calendar_type: 'gregorian' | 'parsi';
  gregorian_month?: number;
  gregorian_day?: number;
  parsi_month?: number;
  parsi_roj?: number;
  recurrence: '' | 'monthly' | 'yearly';
  reminder: boolean;
}

const parsiMonths = [
  "Fravardin", "Ardibehesht", "Khordad", "Tir", "Amardad", "Shehrevar",
  "Meher", "Avan", "Adar", "Dae", "Bahman", "Aspandarmad", "Gatha"
];
const gathaDays = [
  "Ahunavaiti", "Ushtavaiti", "Spentamainyu", "Vohuxshathra", "Vahishtoishti"
];
const parsiRoj = [
  "Hormazd", "Bahman", "Ardibehesht", "Shehrevar", "Aspandard",
  "Khordad", "Amardad", "Dae-Pa-Adar", "Adar", "Avan",
  "Khorshed", "Mohor", "Tir", "Gosh", "Dae-Pa-Meher",
  "Meher", "Srosh", "Rashne", "Fravardin", "Behram",
  "Ram", "Govad", "Dae-Pa-Din", "Din", "Ashishvangh",
  "Ashtad", "Asman", "Zamyad", "Mareshpand", "Aneran"
];
const gregorianMonths = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const gregorianDays = Array.from({ length: 31 }, (_, i) => i + 1);

export default function EventModal({
  open,
  onClose,
  onSave,
  initialData
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventData) => void;
  initialData?: Partial<EventData>;
}) {
  const [form, setForm] = useState<EventData>({
    title: initialData?.title || '',
    event_type: (initialData?.event_type as EventData['event_type']) || 'none',
    calendar_type: initialData?.calendar_type || 'gregorian',
    gregorian_month: initialData?.gregorian_month ?? 0,
    gregorian_day: initialData?.gregorian_day ?? 1,
    parsi_month: initialData?.parsi_month ?? 0,
    parsi_roj: initialData?.parsi_roj ?? 1,
    recurrence: initialData?.recurrence || '',
    reminder: initialData?.reminder ?? false,
    id: initialData?.id
  });

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      setForm({
        title: initialData?.title || '',
        event_type: (initialData?.event_type as EventData['event_type']) || 'none',
        calendar_type: initialData?.calendar_type || 'gregorian',
        gregorian_month: initialData?.gregorian_month ?? 0,
        gregorian_day: initialData?.gregorian_day ?? 1,
        parsi_month: initialData?.parsi_month ?? 0,
        parsi_roj: initialData?.parsi_roj ?? 1,
        recurrence: initialData?.recurrence || '',
        reminder: initialData?.reminder ?? false,
        id: initialData?.id
      });
    }
  }, [open, initialData]);

  const handleRecurrenceChange = (val: string) => {
    setForm(f => ({ ...f, recurrence: val as EventData['recurrence'] }));
  };

  const handleClose = () => {
    // Clear form when closing
    setForm({
      title: '',
      event_type: 'none',
      calendar_type: 'gregorian',
      gregorian_month: 0,
      gregorian_day: 1,
      parsi_month: 0,
      parsi_roj: 1,
      recurrence: '',
      reminder: false
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="card-header d-flex align-items-center justify-content-between">
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {form.id ? 'Edit Event' : 'New Event'}
          </h2>
          <button 
            onClick={handleClose}
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
          <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
            <div className="mb-3">
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                Event Title *
              </label>
              <input 
                type="text" 
                placeholder="Add title" 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                required 
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                Event Type
              </label>
              <select
                value={form.event_type}
                onChange={e => setForm(f => ({ ...f, event_type: e.target.value as EventData['event_type'] }))}
                className="form-control"
              >
                <option value="none">None</option>
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="navjote">Navjote</option>
                <option value="death">Baj</option>
              </select>
            </div>

            <div className="d-flex gap-3 mb-3" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Calendar Type
                </label>
                <select 
                  value={form.calendar_type} 
                  onChange={e => setForm(f => ({ ...f, calendar_type: e.target.value as 'gregorian' | 'parsi' }))} 
                  className="form-control"
                >
                  <option value="gregorian">Gregorian</option>
                  <option value="parsi">Parsi</option>
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Recurrence
                </label>
                <select 
                  value={form.recurrence} 
                  onChange={e => handleRecurrenceChange(e.target.value)} 
                  className="form-control"
                >
                  <option value="">Does not repeat</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>


            {(form.calendar_type === 'gregorian' || form.calendar_type === 'parsi') && (
              <div className="mb-3">
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Date
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {form.calendar_type === 'gregorian' && (
                    <>
                      <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Month</label>
                      <select 
                        value={form.gregorian_month} 
                        onChange={e => setForm(f => ({ ...f, gregorian_month: Number(e.target.value) }))} 
                        className="form-control"
                        style={{ marginBottom: form.recurrence === 'monthly' ? 0 : '4px' }}
                      >
                        {gregorianMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                      </select>
                      {form.recurrence !== 'monthly' && (
                        <>
                          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px', marginTop: '2px' }}>Day</label>
                          <select 
                            value={form.gregorian_day} 
                            onChange={e => setForm(f => ({ ...f, gregorian_day: Number(e.target.value) }))} 
                            className="form-control"
                          >
                            {gregorianDays.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </>
                      )}
                    </>
                  )}
                  {form.calendar_type === 'parsi' && (
                    <>
                      <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Mah</label>
                      <select
                        value={form.parsi_month}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setForm(f => ({
                            ...f,
                            parsi_month: val,
                            // If Gatha is selected, default roj to 1 (first Gatha day)
                            parsi_roj: val === 12 ? 1 : (typeof f.parsi_roj === 'number' ? (f.parsi_roj > 30 ? 1 : f.parsi_roj) : 1)
                          }));
                        }}
                        className="form-control"
                        style={{ marginBottom: form.recurrence === 'monthly' ? 0 : '4px' }}
                      >
                        {parsiMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                      </select>
                      {form.recurrence !== 'monthly' && (
                        <>
                          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px', marginTop: '2px' }}>{form.parsi_month === 12 ? 'Gatha Day' : 'Roj'}</label>
                          <select
                            value={form.parsi_roj}
                            onChange={e => setForm(f => ({ ...f, parsi_roj: Number(e.target.value) }))}
                            className="form-control"
                          >
                            {form.parsi_month === 12
                              ? gathaDays.map((g, idx) => <option key={idx + 1} value={idx + 1}>{g}</option>)
                              : parsiRoj.map((r, idx) => <option key={idx + 1} value={idx + 1}>{r}</option>)}
                          </select>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px', 
                fontWeight: '500', 
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  checked={form.reminder} 
                  onChange={e => setForm(f => ({ ...f, reminder: e.target.checked }))}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    accentColor: 'var(--primary-blue)'
                  }}
                />
                Enable reminder
              </label>
              <button style={{ position: 'absolute', justifyContent:'left' }}> Year</button>
            </div>

            <div className="d-flex justify-content-between gap-3" style={{ flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={handleClose} 
                className="btn btn-secondary"
                style={{ flex: '1', minWidth: '120px' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ flex: '1', minWidth: '120px' }}
              >
                {form.id ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}