export default function KpiCards({ items }: { items: { label: string; value: number; trend: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card p-4">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-brand-700">{item.value}</p>
          <p className="mt-1 text-xs text-emerald-600">{item.trend}</p>
        </div>
      ))}
    </div>
  );
}
