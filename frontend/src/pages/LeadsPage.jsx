import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, deleteLead } from '../api/leads.api';
import { getStages } from '../api/pipeline.api';
import Badge from '../components/common/Badge';
import { formatCurrency, formatDate, timeAgo } from '../utils/formatters';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';

const SOURCE_ICONS = { whatsapp: '💬', website: '🌐', manual: '✏️' };

export default function LeadsPage() {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', stage_id: '', source: '' });

  useEffect(() => {
    getStages().then(({ data }) => setStages(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.stage_id) params.stage_id = filters.stage_id;
    if (filters.source) params.source = filters.source;

    getLeads(params).then(({ data }) => setLeads(data)).finally(() => setLoading(false));
  }, [filters]);

  async function handleDelete(id, name) {
    if (!confirm(`Delete lead "${name || id}"?`)) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      dispatch(addToast({ type: 'success', message: 'Lead deleted' }));
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to delete lead' }));
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Link to="/pipeline" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text" placeholder="Search name, phone, email..." value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select value={filters.stage_id} onChange={(e) => setFilters({ ...filters, stage_id: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Stages</option>
          {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website">Website</option>
          <option value="manual">Manual</option>
        </select>
        {(filters.search || filters.stage_id || filters.source) && (
          <button onClick={() => setFilters({ search: '', stage_id: '', source: '' })}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No leads found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/leads/${lead.id}`} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {(lead.name || lead.phone || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-indigo-600">{lead.name || '—'}</p>
                        <p className="text-xs text-gray-400">{lead.phone}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3"><Badge label={lead.stage_name} color={lead.stage_color} /></td>
                  <td className="px-4 py-3">
                    <span title={lead.source}>{SOURCE_ICONS[lead.source]} <span className="capitalize text-gray-600">{lead.source}</span></span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{lead.deal_value > 0 ? formatCurrency(lead.deal_value) : '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{timeAgo(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/leads/${lead.id}`} className="text-indigo-500 hover:text-indigo-700 text-xs">View</Link>
                      <button onClick={() => handleDelete(lead.id, lead.name)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
