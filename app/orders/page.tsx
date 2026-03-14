import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { orders } from "@/lib/mockData";

export default function OrdersPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Orders</h1>
        <div className="card flex flex-wrap gap-3 p-4">
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">+ Create Order</button>
          <button className="rounded-md border px-3 py-2">Mark Paid</button>
          <button className="rounded-md border px-3 py-2">Ready for Pickup</button>
          <button className="rounded-md border px-3 py-2">Complete</button>
        </div>
        <DataTable
          title="Order Control"
          columns={[
            { key: "no", label: "Order No" },
            { key: "customer", label: "Customer" },
            { key: "part", label: "Part" },
            { key: "amount", label: "Amount" },
            { key: "payment", label: "Payment", type: "status" },
            { key: "status", label: "Order Status", type: "status" },
          ]}
          rows={orders}
        />
      </div>
    </AppLayout>
  );
}
