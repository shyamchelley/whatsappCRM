import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStages, createStage, updateStage, deleteStage, reorderStages } from '../api/pipeline.api';
import client from '../api/client';
import { setCredentials } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import { getSocket } from '../socket';

/* ── Colour swatches for stages ── */
const SWATCHES = [
  '#6366f1','#3b82f6','#8b5cf6','#ec4899',
  '#f59e0b','#f97316','#22c55e','#ef4444',
  '#14b8a6','#64748b',
];

function StageRow({ stage, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(stage.name);
  const [color, setColor]       = useState(stage.color);
  const [saving, setSaving]     = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await onUpdate(stage.id, { name: name.trim(), color });
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Drag handle / order buttons */}
      <div className="flex flex-col gap-0.5">
        <button onClick={onMoveUp} disabled={isFirst}
          className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">▲</button>
        <button onClick={onMoveDown} disabled={isLast}
          className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">▼</button>
      </div>

      {/* Color dot */}
      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />

      {editing ? (
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-32 px-2.5 py-1.5 border border-indigo-400 rounded-lg text-sm focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && save()} autoFocus />
          <div className="flex gap-1">
            {SWATCHES.map((c) => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg disabled:bg-indigo-300">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setEditing(false); setName(stage.name); setColor(stage.color); }}
              className="px-3 py-1.5 border border-gray-300 text-xs rounded-lg text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <span className="flex-1 text-sm font-medium text-gray-800">{stage.name}</span>
          {stage.is_terminal && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stage.is_won ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {stage.is_won ? 'Won' : 'Lost'}
            </span>
          )}
          <button onClick={() => setEditing(true)}
            className="text-xs text-indigo-500 hover:text-indigo-700 px-2 py-1">Edit</button>
          {!stage.is_terminal && (
            <button onClick={() => onDelete(stage.id, stage.name)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1">Delete</button>
          )}
        </>
      )}
    </div>
  );
}

/* ── Profile section ── */
function ProfileSection() {
  const dispatch   = useDispatch();
  const user       = useSelector((s) => s.auth.user);
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving]   = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg]         = useState('');
  const [pwMsg, setPwMsg]     = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const { data } = await client.patch('/auth/me', { name: form.name, email: form.email });
      dispatch(setCredentials({ accessToken: localStorage.getItem('accessToken'), user: data }));
      setMsg('Profile updated successfully.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally { setSaving(false); }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
    if (pwForm.next.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
    setSavingPw(true); setPwMsg('');
    try {
      await client.patch('/auth/me/password', { current: pwForm.current, next: pwForm.next });
      setPwMsg('Password changed successfully.');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.error || 'Failed to change password.');
    } finally { setSavingPw(false); }
  }

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile Information</h2>
        {msg && <p className={`text-sm mb-4 px-3 py-2 rounded-lg ${msg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</p>}
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm rounded-lg">
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
            <span className="text-xs text-gray-400 capitalize">Role: {user?.role}</span>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Change Password</h2>
        {pwMsg && <p className={`text-sm mb-4 px-3 py-2 rounded-lg ${pwMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{pwMsg}</p>}
        <form onSubmit={changePassword} className="space-y-4 max-w-sm">
          {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([field, label]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="password" value={pwForm[field]}
                onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <button type="submit" disabled={savingPw}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white text-sm rounded-lg">
            {savingPw ? 'Changing…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Pipeline stages section ── */
function PipelineSection() {
  const dispatch        = useDispatch();
  const user            = useSelector((s) => s.auth.user);
  const [stages, setStages]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [newName, setNewName]   = useState('');
  const [newColor, setNewColor] = useState('#6366f1');
  const [adding, setAdding]     = useState(false);

  async function load() {
    const { data } = await getStages();
    setStages(data);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await createStage({ name: newName.trim(), color: newColor });
      setNewName(''); setNewColor('#6366f1');
      await load();
      dispatch(addToast({ type: 'success', message: 'Stage created' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create stage' }));
    } finally { setAdding(false); }
  }

  async function handleUpdate(id, data) {
    try {
      await updateStage(id, data);
      await load();
      dispatch(addToast({ type: 'success', message: 'Stage updated' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.error || 'Failed to update stage' }));
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete stage "${name}"? This will fail if leads exist in it.`)) return;
    try {
      await deleteStage(id);
      await load();
      dispatch(addToast({ type: 'success', message: 'Stage deleted' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.error || 'Cannot delete stage' }));
    }
  }

  async function move(index, direction) {
    const newStages = [...stages];
    const target = index + direction;
    if (target < 0 || target >= newStages.length) return;
    [newStages[index], newStages[target]] = [newStages[target], newStages[index]];
    setStages(newStages);
    await reorderStages(newStages.map((s) => s.id));
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-900">Pipeline Stages</h2>
        <span className="text-xs text-gray-400">{stages.length} stages</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">Drag using ▲▼ to reorder. Won and Lost stages cannot be deleted.</p>

      {loading ? <p className="text-sm text-gray-400">Loading stages…</p> : (
        <div>
          {stages.map((stage, i) => (
            <StageRow key={stage.id} stage={stage}
              onUpdate={isAdmin ? handleUpdate : () => {}}
              onDelete={isAdmin ? handleDelete : () => {}}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              isFirst={i === 0}
              isLast={i === stages.length - 1} />
          ))}
        </div>
      )}

      {isAdmin && (
        <form onSubmit={handleAdd} className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-medium text-gray-600 mb-1">New Stage Name</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Follow-up"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
            <div className="flex gap-1">
              {SWATCHES.map((c) => (
                <button key={c} type="button" onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${newColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <button type="submit" disabled={adding || !newName.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm rounded-lg whitespace-nowrap">
            {adding ? 'Adding…' : '+ Add Stage'}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Widget embed section ── */
function WidgetSection() {
  const [copied, setCopied] = useState(false);
  const snippet = `<div id="crm-widget-root"
  data-api-base="http://localhost:3001"
  data-site-token="${import.meta.env.VITE_SITE_TOKEN || 'your_site_token'}"
  data-title="Contact Us"
  data-subtitle="We reply within 1 hour">
</div>
<script src="http://localhost:3001/widget/crm-widget.iife.js"></script>`;

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Website Widget</h2>
      <p className="text-xs text-gray-400 mb-4">Copy and paste this snippet into any webpage to capture leads.</p>
      <div className="relative">
        <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">{snippet}</pre>
        <button onClick={copy}
          className="absolute top-3 right-3 px-3 py-1.5 bg-white text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-500">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-medium text-gray-700 mb-1">data-api-base</p>
          <p>Your backend URL</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-medium text-gray-700 mb-1">data-site-token</p>
          <p>Value of SITE_TOKEN in .env</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="font-medium text-gray-700 mb-1">data-title</p>
          <p>Widget heading text</p>
        </div>
      </div>
    </div>
  );
}

/* ── WhatsApp connection section ── */
function WhatsAppSection() {
  const [status, setStatus]   = useState('loading');
  const [qrUrl, setQrUrl]     = useState(null);

  useEffect(() => {
    // Fetch initial status
    client.get('/whatsapp/status').then(({ data }) => setStatus(data.status)).catch(() => setStatus('disconnected'));

    // Listen for real-time updates
    const socket = getSocket();
    if (!socket) return;

    function onQr({ qr }) { setQrUrl(qr); setStatus('qr'); }
    function onStatus({ status: s }) { setStatus(s); if (s === 'ready') setQrUrl(null); }

    socket.on('whatsapp:qr', onQr);
    socket.on('whatsapp:status', onStatus);
    return () => { socket.off('whatsapp:qr', onQr); socket.off('whatsapp:status', onStatus); };
  }, []);

  const statusMeta = {
    loading:     { color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400',   label: 'Checking…' },
    disconnected:{ color: 'bg-red-50 text-red-700',      dot: 'bg-red-500',    label: 'Disconnected' },
    qr:          { color: 'bg-yellow-50 text-yellow-700', dot: 'bg-yellow-400', label: 'Scan QR Code' },
    connecting:  { color: 'bg-blue-50 text-blue-700',    dot: 'bg-blue-400',   label: 'Connecting…' },
    ready:       { color: 'bg-green-50 text-green-700',  dot: 'bg-green-500',  label: 'Connected' },
  };
  const meta = statusMeta[status] || statusMeta.disconnected;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
      <h2 className="text-base font-semibold text-gray-900 mb-1">WhatsApp Connection</h2>
      <p className="text-xs text-gray-400 mb-5">
        Connect your WhatsApp number by scanning the QR code below. No business account or API key needed.
      </p>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${meta.color}`}>
        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
        {meta.label}
      </div>

      {/* QR code */}
      {status === 'qr' && qrUrl && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <img src={qrUrl} alt="WhatsApp QR Code" className="w-56 h-56 rounded-xl border border-gray-200 shadow-sm" />
          <p className="text-xs text-gray-500 text-center">
            Open WhatsApp on your phone → <strong>Linked Devices</strong> → <strong>Link a Device</strong> → scan this code
          </p>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm font-medium text-green-800">WhatsApp is connected!</p>
            <p className="text-xs text-green-600 mt-0.5">Inbound messages will automatically create leads. You can reply from any Lead's detail page.</p>
          </div>
        </div>
      )}

      {(status === 'disconnected' || status === 'loading') && !qrUrl && status !== 'ready' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
          {status === 'loading' ? 'Checking connection…' : 'Restart the server to get a new QR code.'}
        </div>
      )}

      {status === 'connecting' && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-600">
          Authenticating with WhatsApp, please wait…
        </div>
      )}
    </div>
  );
}

/* ── Main Settings Page ── */
const TABS = [
  { id: 'profile',   label: '👤 Profile' },
  { id: 'pipeline',  label: '🏗️ Pipeline Stages' },
  { id: 'widget',    label: '🔌 Widget Embed' },
  { id: 'whatsapp',  label: '💬 WhatsApp' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile'   && <ProfileSection />}
      {tab === 'pipeline'  && <PipelineSection />}
      {tab === 'widget'    && <WidgetSection />}
      {tab === 'whatsapp'  && <WhatsAppSection />}
    </div>
  );
}
