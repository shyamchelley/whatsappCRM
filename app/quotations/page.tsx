import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { quotations } from "@/lib/mockData";

export default function QuotationsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Quotations</h1>
        <div className="card flex flex-wrap gap-3 p-4">
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">+ New Quotation</button>
          <button className="rounded-md border px-3 py-2">Share via WhatsApp</button>
          <button className="rounded-md border px-3 py-2">Revise</button>
          <button className="rounded-md border px-3 py-2">Mark Accepted</button>
        </div>
        <DataTable
          title="Quotation Tracker"
          columns={[
            { key: "no", label: "Quote No" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total" },
            { key: "validity", label: "Validity" },
            { key: "status", label: "Status", type: "status" },
          ]}
          rows={quotations}
        />
      </div>
    </AppLayout>
  );
}
