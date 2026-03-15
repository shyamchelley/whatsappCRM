import AppLayout from "@/components/AppLayout";
import DataTable from "@/components/DataTable";
import { agents } from "@/lib/mockData";

export default function AgentsPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="page-title">Agents Performance</h1>
        <DataTable
          title="Daily Agent KPIs"
          columns={[
            { key: "name", label: "Agent" },
            { key: "enquiries", label: "Enquiries" },
            { key: "quotes", label: "Quotes" },
            { key: "converted", label: "Converted" },
            { key: "revenue", label: "Revenue" },
          ]}
          rows={agents}
        />
      </div>
    </AppLayout>
  );
}
