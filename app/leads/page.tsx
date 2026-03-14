import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { leads } from "@/lib/mockData";

export default function LeadsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Leads / Enquiries</h1>
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">+ Quick Lead</button>
        </div>

        <div className="card grid gap-3 p-4 md:grid-cols-3">
          <input className="rounded-md border px-3 py-2" placeholder="Customer mobile" />
          <select className="rounded-md border px-3 py-2"><option>All Channels</option><option>WhatsApp</option><option>Phone</option><option>Email</option><option>Walk-in</option></select>
          <select className="rounded-md border px-3 py-2"><option>All Statuses</option><option>New</option><option>Quote Shared</option><option>Confirmed</option></select>
        </div>

        <DataTable
          title="Enquiry Pipeline"
          columns={[
            { key: "id", label: "Lead No" },
            { key: "customer", label: "Customer" },
            { key: "mobile", label: "Mobile" },
            { key: "channel", label: "Channel" },
            { key: "agent", label: "Agent" },
            { key: "priority", label: "Priority" },
            { key: "status", label: "Status", type: "status" },
          ]}
          rows={leads}
        />
      </div>
    </AppLayout>
  );
}
