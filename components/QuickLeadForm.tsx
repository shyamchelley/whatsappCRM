export default function QuickLeadForm() {
  return (
    <div className="card p-4">
      <h2 className="mb-3 text-lg font-semibold">Quick Lead Entry</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input className="rounded-md border px-3 py-2" placeholder="Customer name" />
        <input className="rounded-md border px-3 py-2" placeholder="Mobile" />
        <select className="rounded-md border px-3 py-2">
          <option>Source Channel</option>
          <option>WhatsApp</option>
          <option>Phone</option>
          <option>Email</option>
          <option>Walk-in</option>
          <option>Website</option>
        </select>
        <input className="rounded-md border px-3 py-2" placeholder="VIN / Model" />
        <input className="rounded-md border px-3 py-2 md:col-span-2" placeholder="Parts requested" />
        <select className="rounded-md border px-3 py-2">
          <option>Assigned Agent</option>
          <option>Fatima Noor</option>
          <option>Yousef Adel</option>
          <option>Reem Tariq</option>
        </select>
        <select className="rounded-md border px-3 py-2">
          <option>Priority</option>
          <option>Normal</option>
          <option>High</option>
          <option>Urgent</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-md bg-brand-700 px-3 py-2 text-sm text-white">Save Lead</button>
        <button className="rounded-md border px-3 py-2 text-sm">Save & Quote</button>
        <button className="rounded-md border px-3 py-2 text-sm">Save & Convert to Order</button>
        <button className="rounded-md border px-3 py-2 text-sm">Create Token</button>
      </div>
    </div>
  );
}
