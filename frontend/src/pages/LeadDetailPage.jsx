import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLead, getActivities, getNotes, getReminders, updateLead, deleteLead } from '../api/leads.api';
import { getStages } from '../api/pipeline.api';
import Badge from '../components/common/Badge';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import NotesList from '../components/leads/NotesList';
import ReminderCard from '../components/leads/ReminderCard';
import WhatsAppChat from '../components/leads/WhatsAppChat';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';

const SOURCE_ICONS = { whatsapp: '💬', website: '🌐', manual: '✏️' };

function EditableField({ label, value, onSave, type, options }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');
  const fieldType = type || 'text';

  async function handleBlur() {
    setEditing(false);
    if (String(val) !== String(value)) await onSave(val);
  }

  if (editing && options) {
    return (
      <div>
        <label className="block text-xs text-gray-400 mb-0.5">{label}</label>
        <select value={val} onChange={(e) => setVal(e.target.value)} onBlur={handleBlur} autoFocus
          className="w-full px-2 py-1 border border-indigo-400 rounded text-sm focus:outline-none">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
  if (editing) {
    return (
      <div>
        <label className="block text-xs text-gray-400 mb-0.5">{label}</label>
        <input type={fieldType} value={val} onChange={(e) => setVal(e.target.value)} onBlur={handleBlur} autoFocus
          className="w-full px-2 py-1 border border-indigo-400 rounded text-sm focus:outline-none" />
      </div>
    );
  }
  return (
    <div className="cursor-pointer group" onClick={() => { setVal(value || ''); setEditing(true); }}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 group-hover:text-indigo-600 transition-colors">
        {value || <span className="text-gray-300">Click to edit</span>}
      </p>
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');

  async function fetchAll() {
    try {
      const [l, a, n, r] = await Promise.all([getLead(id), getActivities(id), getNotes(id), getReminders(id)]);
      setLead(l.data); setActivities(a.data); setNotes(n.data); setReminders(r.data);
    } catch { dispatch(addToast({ type: 'error', message: 'Failed to load lead' })); }
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAll(), getStages().then(({ data }) => setStages(data))]).finally(() => setLoading(false));
  }, [id]);

  async function handleFieldSave(field, value) {
    try {
      const { data } = await updateLead(id, { [field]: value });
      setLead(data);
      dispatch(addToast({ type: 'success', message: 'Updated' }));
    } catch { dispatch(addToast({ type: 'error', message: 'Failed to update' })); }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this lead?')) return;
    await deleteLead(id);
    navigate('/leads');
  }

  if (loading) return <div className="p-8 text-gray-400">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-red-400">Lead not found</div>;

  const pendingReminders = reminders.filter((r) => !r.is_done).length;
  const tabs = [['activity', 'Activity', 0], ['notes', 'Notes', 0], ['reminders', 'Reminders', pendingReminders], ['whatsapp', 'WhatsApp', 0]];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/leads" className="hover:text-indigo-600">Leads</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{lead.name || lead.phone}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                  {(lead.name || lead.phone || '?')[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{lead.name || '—'}</h1>
                  <Badge label={lead.stage_name} color={lead.stage_color} />
                </div>
              </div>
              <span className="text-xl" title={lead.source}>{SOURCE_ICONS[lead.source]}</span>
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <EditableField label="Name" value={lead.name} onSave={(v) => handleFieldSave('name', v)} />
              <EditableField label="Phone" value={lead.phone} onSave={(v) => handleFieldSave('phone', v)} />
              <EditableField label="Email" value={lead.email} type="email" onSave={(v) => handleFieldSave('email', v)} />
              <EditableField label="Deal Value ($)" value={lead.deal_value} type="number" onSave={(v) => handleFieldSave('deal_value', parseFloat(v) || 0)} />
              <EditableField label="Stage" value={lead.stage_id}
                options={stages.map((s) => ({ value: s.id, label: s.name }))}
                onSave={(v) => handleFieldSave('stage_id', parseInt(v))} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Source</span><span className="capitalize font-medium text-gray-700">{lead.source}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Deal Value</span><span className="font-medium text-indigo-600">{formatCurrency(lead.deal_value)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Created</span><span className="text-gray-700">{formatDate(lead.created_at)}</span></div>
            {lead.assigned_name && <div className="flex justify-between text-sm"><span className="text-gray-400">Assigned to</span><span className="text-gray-700">{lead.assigned_name}</span></div>}
          </div>
          <button onClick={handleDelete} className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Delete Lead</button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {tabs.map(([key, label, badge]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
                {badge > 0 && <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{badge}</span>}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {activeTab === 'activity' && <ActivityTimeline activities={activities} />}
            {activeTab === 'notes' && <NotesList leadId={id} notes={notes} onRefresh={fetchAll} />}
            {activeTab === 'reminders' && <ReminderCard leadId={id} reminders={reminders} onRefresh={fetchAll} />}
            {activeTab === 'whatsapp' && <WhatsAppChat leadId={id} leadPhone={lead.wa_phone_number || lead.phone} />}
          </div>
        </div>
      </div>
    </div>
  );
}
