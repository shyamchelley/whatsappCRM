import { useState } from 'react';
import { createReminder, updateReminder, deleteReminder } from '../../api/leads.api';
import { formatDateTime } from '../../utils/formatters';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/uiSlice';

export default function ReminderCard({ leadId, reminders, onRefresh }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ message: '', due_at: '' });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createReminder(leadId, form);
      setForm({ message: '', due_at: '' });
      setShowForm(false);
      onRefresh();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to set reminder' }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDone(remId) {
    await updateReminder(leadId, remId, { is_done: true });
    onRefresh();
  }

  async function handleDelete(remId) {
    await deleteReminder(leadId, remId);
    onRefresh();
  }

  return (
    <div className="space-y-3">
      <button onClick={() => setShowForm(!showForm)}
        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
        + Set Reminder
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-50 rounded-lg p-3 space-y-3">
          <input required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Reminder message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input required type="datetime-local" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-gray-500 px-3 py-1.5 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:bg-indigo-300">
              {saving ? 'Saving...' : 'Set'}
            </button>
          </div>
        </form>
      )}

      {reminders.map((r) => (
        <div key={r.id} className={`flex items-start gap-3 rounded-lg p-3 ${r.is_done ? 'bg-gray-50 opacity-60' : 'bg-amber-50'}`}>
          <span className="text-base mt-0.5">⏰</span>
          <div className="flex-1">
            <p className={`text-sm ${r.is_done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{r.message}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(r.due_at)}</p>
          </div>
          <div className="flex gap-1">
            {!r.is_done && (
              <button onClick={() => handleDone(r.id)} className="text-xs text-green-600 hover:text-green-800" title="Mark done">✓</button>
            )}
            <button onClick={() => handleDelete(r.id)} className="text-xs text-red-400 hover:text-red-600" title="Delete">✕</button>
          </div>
        </div>
      ))}

      {reminders.length === 0 && !showForm && <p className="text-sm text-gray-400">No reminders set.</p>}
    </div>
  );
}
