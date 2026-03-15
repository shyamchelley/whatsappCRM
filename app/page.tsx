import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import KpiCards from "@/components/KpiCards";
import SimpleBarChart from "@/components/SimpleBarChart";
import { kpis, leads, tokens } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Mercedes-Benz Spare Parts CRM Dashboard</h1>
          <div className="flex gap-2">
            <button className="rounded-md border px-3 py-2 text-sm">Create Token</button>
            <button className="rounded-md bg-brand-700 px-3 py-2 text-sm text-white">New Order</button>
          </div>
        </div>

        <KpiCards items={kpis} />

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SimpleBarChart />
          </div>
          <DataTable
            title="Live Token Queue"
            columns={[
              { key: "token", label: "Token" },
              { key: "type", label: "Type" },
              { key: "wait", label: "Wait" },
              { key: "status", label: "Status", type: "status" },
            ]}
            rows={tokens}
          />
        </div>

        <DataTable
          title="Priority Leads"
          columns={[
            { key: "id", label: "Lead" },
            { key: "customer", label: "Customer" },
            { key: "channel", label: "Channel" },
            { key: "agent", label: "Agent" },
            { key: "status", label: "Status", type: "status" },
          ]}
          rows={leads}
        />
      </div>
    </AppLayout>
  );
}
