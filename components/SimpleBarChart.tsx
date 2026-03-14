export default function SimpleBarChart() {
  const bars = [58, 76, 69, 88, 74, 92, 81];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly Order Volume</h3>
        <span className="text-xs text-slate-500">Dubai Branch</span>
      </div>
      <div className="flex h-48 items-end gap-3">
        {bars.map((bar, index) => (
          <div key={days[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-md bg-brand-500" style={{ height: `${bar}%` }} />
            <span className="text-xs text-slate-500">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
