import React, { useState } from 'react';

export interface EventData {
  id?: string;
  title: string;
  description: string;
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
  "Meher", "Avan", "Adar", "Dae", "Bahman", "Aspandarmad"
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
    description: initialData?.description || '',
    calendar_type: initialData?.calendar_type || 'gregorian',
    gregorian_month: initialData?.gregorian_month ?? 0,
    gregorian_day: initialData?.gregorian_day ?? 1,
    parsi_month: initialData?.parsi_month ?? 0,
    parsi_roj: initialData?.parsi_roj ?? 1,
    recurrence: initialData?.recurrence || '',
    reminder: initialData?.reminder ?? false,
    id: initialData?.id
  });

  // Handle frequency change
  const handleRecurrenceChange = (val: string) => {
    setForm(f => ({ ...f, recurrence: val as EventData['recurrence'] }));
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px #aaa', position: 'relative' }}>
        <h3 style={{ marginBottom: 12 }}>{form.id ? 'Edit Event' : 'Add Event'}</h3>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Select Frequency:&nbsp;</label>
            <select value={form.recurrence} onChange={e => handleRecurrenceChange(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
              <option value="">No Recurrence</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500 }}>Choose Calendar:&nbsp;</label>
            <select value={form.calendar_type} onChange={e => setForm(f => ({ ...f, calendar_type: e.target.value as 'gregorian' | 'parsi' }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
              <option value="gregorian">English</option>
              <option value="parsi">Parsi</option>
            </select>
          </div>

          {form.calendar_type === 'gregorian' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {form.recurrence !== 'monthly' && (
                <select value={form.gregorian_month} onChange={e => setForm(f => ({ ...f, gregorian_month: Number(e.target.value) }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
                  {gregorianMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              )}
              <select value={form.gregorian_day} onChange={e => setForm(f => ({ ...f, gregorian_day: Number(e.target.value) }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
                {gregorianDays.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          {form.calendar_type === 'parsi' && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {form.recurrence !== 'monthly' && (
                <select value={form.parsi_month} onChange={e => setForm(f => ({ ...f, parsi_month: Number(e.target.value) }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
                  {parsiMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              )}
              <select value={form.parsi_roj} onChange={e => setForm(f => ({ ...f, parsi_roj: Number(e.target.value) }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #ccc' }}>
                {parsiRoj.map((r, idx) => <option key={idx + 1} value={idx + 1}>{r}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label><input type="checkbox" checked={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.checked }))} /> Reminder</label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#eee' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600 }}>{form.id ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
