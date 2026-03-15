import AppLayout from "@/components/AppLayout";
import { reports } from "@/lib/mockData";

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Reports</h1>
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">Export CSV</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((item) => (
            <div key={item.metric} className="card p-4">
              <p className="text-sm text-slate-500">{item.metric}</p>
              <p className="mt-2 text-2xl font-semibold text-brand-700">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="card p-4">
          <h3 className="mb-3 text-lg font-semibold">Lost Reasons Breakdown</h3>
          <div className="space-y-2">
            <div><p className="text-sm">Price too high</p><div className="h-2 rounded bg-slate-200"><div className="h-2 w-2/3 rounded bg-brand-700" /></div></div>
            <div><p className="text-sm">Part not available</p><div className="h-2 rounded bg-slate-200"><div className="h-2 w-1/2 rounded bg-brand-700" /></div></div>
            <div><p className="text-sm">Customer bought elsewhere</p><div className="h-2 rounded bg-slate-200"><div className="h-2 w-1/3 rounded bg-brand-700" /></div></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
