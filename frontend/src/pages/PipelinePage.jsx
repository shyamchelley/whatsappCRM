import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard, setLoading } from '../store/pipelineSlice';
import { getBoard } from '../api/pipeline.api';
import { createLead } from '../api/leads.api';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Modal from '../components/common/Modal';
import { addToast } from '../store/uiSlice';

export default function PipelinePage() {
  const dispatch = useDispatch();
  const { board, loading } = useSelector((s) => s.pipeline);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', deal_value: '', source: 'manual' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    getBoard().then(({ data }) => dispatch(setBoard(data))).finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createLead({ ...form, deal_value: parseFloat(form.deal_value) || 0 });
      const { data } = await getBoard();
      dispatch(setBoard(data));
      dispatch(addToast({ type: 'success', message: 'Lead created successfully' }));
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', deal_value: '', source: 'manual' });
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create lead' }));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading pipeline...</div>;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {board.reduce((sum, s) => sum + s.leads.length, 0)} leads total
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Lead
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <KanbanBoard board={board} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Lead">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+1234567890" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value ($)</label>
              <input type="number" min="0" value={form.deal_value} onChange={(e) => setForm({ ...form, deal_value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="manual">Manual</option>
              <option value="website">Website</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg">
              {saving ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
