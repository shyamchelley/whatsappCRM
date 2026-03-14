import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { customers } from "@/lib/mockData";

export default function CustomersPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Customers</h1>
        <div className="card grid gap-3 p-4 md:grid-cols-4">
          <input className="rounded-md border px-3 py-2" placeholder="Search by mobile" />
          <input className="rounded-md border px-3 py-2" placeholder="Customer name" />
          <select className="rounded-md border px-3 py-2"><option>All Types</option><option>Retail</option><option>B2B</option></select>
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">+ Add Customer</button>
        </div>
        <DataTable
          title="Customer Directory"
          columns={[
            { key: "name", label: "Name" },
            { key: "mobile", label: "Mobile" },
            { key: "type", label: "Type" },
            { key: "model", label: "Vehicle/Fleet" },
            { key: "totalOrders", label: "Orders" },
            { key: "vip", label: "VIP" },
          ]}
          rows={customers}
        />
      </div>
    </AppLayout>
  );
}
