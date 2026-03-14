import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-700">Mercedes-Benz Spare Parts CRM</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue to sales operations.</p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Mobile or email" />
          <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="Password" />
          <select className="w-full rounded-md border px-3 py-2">
            <option>Dubai Main Branch</option>
            <option>Abu Dhabi Branch</option>
          </select>
          <Link href="/" className="block w-full rounded-md bg-brand-700 px-3 py-2 text-center text-white">
            Login
          </Link>
        </form>
      </div>
    </main>
  );
}
