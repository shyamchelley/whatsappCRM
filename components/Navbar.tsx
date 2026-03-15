import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">Dubai Main Branch</p>
          <p className="text-xs text-slate-500">Sales Desk + Token Control</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-brand-700 px-3 py-2 text-sm text-white">+ Quick Lead</button>
          <Link href="/login" className="rounded-md border px-3 py-2 text-sm">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
