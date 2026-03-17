import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import * as dashApi from '../api/dashboard.api';
import { formatCurrency, formatDateTime, timeAgo } from '../utils/formatters';
import Badge from '../components/common/Badge';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const SOURCE_COLORS = { whatsapp: '#25D366', website: '#6366f1', manual: '#f59e0b' };

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [bySource, setBySource] = useState([]);
  const [byStage, setByStage] = useState([]);
  const [recent, setRecent] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashApi.getStats(),
      dashApi.getBySource(),
      dashApi.getByStage(),
      dashApi.getRecent(),
      dashApi.getReminders(),
    ]).then(([s, src, stg, rec, rem]) => {
      setStats(s.data);
      setBySource(src.data);
      setByStage(stg.data);
      setRecent(rec.data);
      setReminders(rem.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats?.total_leads ?? 0} />
        <StatCard label="Won Leads" value={stats?.won_leads ?? 0} color="text-green-600" />
        <StatCard label="Pipeline Value" value={formatCurrency(stats?.pipeline_value)} color="text-indigo-600" />
        <StatCard label="Conversion Rate" value={`${stats?.conversion_rate ?? 0}%`} sub="leads to customers" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads by Stage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Leads by Stage</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byStage} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byStage.map((entry, i) => (
                  <Cell key={i} fill={entry.color || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Leads by Source</h2>
          {bySource.length === 0 ? (
            <p className="text-sm text-gray-400 mt-8 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bySource} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={75} label={({ source }) => source}>
                  {bySource.map((entry, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[entry.source] || '#94a3b8'} />
                  ))}
                </Pie>
                <Legend iconSize={10} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Recent Leads</h2>
            <Link to="/leads" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-sm text-gray-400">No leads yet</p>}
            {recent.map((lead) => (
              <Link key={lead.id} to={`/leads/${lead.id}`} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {(lead.name || lead.phone || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{lead.name || lead.phone}</p>
                  <p className="text-xs text-gray-400">{timeAgo(lead.created_at)}</p>
                </div>
                <Badge label={lead.stage_name} color={lead.stage_color} />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Reminders</h2>
          <div className="space-y-3">
            {reminders.length === 0 && <p className="text-sm text-gray-400">No upcoming reminders</p>}
            {reminders.map((r) => (
              <div key={r.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm shrink-0">⏰</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.message}</p>
                  <p className="text-xs text-gray-400">{r.lead_name || r.lead_phone} · {formatDateTime(r.due_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
