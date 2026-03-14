import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { payments } from "@/lib/mockData";

export default function PaymentsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Payments</h1>
        <div className="card grid gap-3 p-4 md:grid-cols-4">
          <select className="rounded-md border px-3 py-2"><option>Mode: All</option><option>Cash</option><option>Card</option><option>Bank Transfer</option></select>
          <select className="rounded-md border px-3 py-2"><option>Status: All</option><option>Paid</option><option>Partial</option><option>Refunded</option></select>
          <input className="rounded-md border px-3 py-2" placeholder="Order number" />
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">+ Record Payment</button>
        </div>
        <DataTable
          title="Cashier Ledger"
          columns={[
            { key: "ref", label: "Payment Ref" },
            { key: "order", label: "Order" },
            { key: "mode", label: "Mode" },
            { key: "amount", label: "Amount" },
            { key: "cashier", label: "Cashier" },
            { key: "status", label: "Status", type: "status" },
          ]}
          rows={payments}
        />
      </div>
    </AppLayout>
  );
}
