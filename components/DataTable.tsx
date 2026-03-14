import StatusBadge from "@/components/StatusBadge";

type Column<T> = { key: keyof T; label: string; type?: "status" | "text" };

type Props<T extends Record<string, string | number>> = {
  title: string;
  columns: Column<T>[];
  rows: T[];
};

export default function DataTable<T extends Record<string, string | number>>({ title, columns, rows }: Props<T>) {
  return (
    <div className="card p-4">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-3 py-2 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-3 py-2">
                    {col.type === "status" ? <StatusBadge status={String(row[col.key])} /> : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
