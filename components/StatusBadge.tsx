type Props = { status: string };

const colorMap: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Unpaid: "bg-rose-100 text-rose-700",
  Waiting: "bg-sky-100 text-sky-700",
  "In Service": "bg-violet-100 text-violet-700",
  Shared: "bg-blue-100 text-blue-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Revised: "bg-orange-100 text-orange-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  "Quote Shared": "bg-indigo-100 text-indigo-700",
  "Awaiting VIN": "bg-yellow-100 text-yellow-700",
  Picking: "bg-cyan-100 text-cyan-700",
  "Ready for Pickup": "bg-green-100 text-green-700",
  "Awaiting Confirmation": "bg-gray-100 text-gray-700",
};

export default function StatusBadge({ status }: Props) {
  return <span className={`badge ${colorMap[status] ?? "bg-slate-100 text-slate-700"}`}>{status}</span>;
}
