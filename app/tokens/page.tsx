import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { tokens } from "@/lib/mockData";

export default function TokensPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Token Queue</h1>
        <div className="grid gap-3 md:grid-cols-5">
          <button className="rounded-md bg-brand-700 px-3 py-2 text-white">Issue Token</button>
          <button className="rounded-md border px-3 py-2">Call Next</button>
          <button className="rounded-md border px-3 py-2">Hold</button>
          <button className="rounded-md border px-3 py-2">No-show</button>
          <button className="rounded-md border px-3 py-2">Complete</button>
        </div>
        <DataTable
          title="Live Walk-in Queue"
          columns={[
            { key: "token", label: "Token" },
            { key: "type", label: "Category" },
            { key: "customer", label: "Customer" },
            { key: "desk", label: "Assigned Desk" },
            { key: "wait", label: "Wait Time" },
            { key: "status", label: "Status", type: "status" },
          ]}
          rows={tokens}
        />
      </div>
    </AppLayout>
  );
}
