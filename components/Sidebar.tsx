"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["Dashboard", "/"],
  ["Customers", "/customers"],
  ["Leads", "/leads"],
  ["Orders", "/orders"],
  ["Token Queue", "/tokens"],
  ["Quotations", "/quotations"],
  ["Payments", "/payments"],
  ["Agents", "/agents"],
  ["Reports", "/reports"],
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="mb-6 rounded-lg bg-brand-700 p-3 text-white">
        <p className="text-xs uppercase tracking-wide">Mercedes-Benz</p>
        <p className="font-semibold">Spare Parts CRM</p>
      </div>
      <nav className="space-y-1">
        {nav.map(([label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active ? "bg-brand-50 text-brand-700 font-medium" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
