export const kpis = [
  { label: "Today's Enquiries", value: 84, trend: "+12%" },
  { label: "Confirmed Orders", value: 37, trend: "+6%" },
  { label: "Tokens Waiting", value: 19, trend: "-8%" },
  { label: "Pending Payments", value: 11, trend: "+2" },
];

export const leads = [
  { id: "L-1001", customer: "Ahmed Kareem", mobile: "+971501112233", channel: "WhatsApp", status: "Quote Shared", agent: "Fatima", priority: "High" },
  { id: "L-1002", customer: "Starline Garage", mobile: "+971503339991", channel: "Phone", status: "Awaiting VIN", agent: "Yousef", priority: "Normal" },
  { id: "L-1003", customer: "M. Al Nuaimi", mobile: "+971556661122", channel: "Walk-in", status: "Confirmed", agent: "Reem", priority: "Urgent" },
];

export const customers = [
  { name: "Ahmed Kareem", mobile: "+971501112233", type: "Retail", model: "C200 2019", totalOrders: 8, vip: "Yes" },
  { name: "Starline Garage", mobile: "+971503339991", type: "B2B", model: "Fleet", totalOrders: 42, vip: "No" },
  { name: "Areej Motors", mobile: "+971588880012", type: "B2B", model: "Mixed", totalOrders: 27, vip: "Yes" },
];

export const orders = [
  { no: "ORD-2301", customer: "Ahmed Kareem", part: "Brake Pads Front", amount: "AED 1,150", payment: "Paid", status: "Ready for Pickup" },
  { no: "ORD-2302", customer: "Starline Garage", part: "Control Arm", amount: "AED 3,980", payment: "Partial", status: "Picking" },
  { no: "ORD-2303", customer: "M. Al Nuaimi", part: "Oil Filter Kit", amount: "AED 290", payment: "Unpaid", status: "Awaiting Confirmation" },
];

export const tokens = [
  { token: "DXB-140", type: "Enquiry", customer: "Walk-in Customer", wait: "14m", status: "Waiting", desk: "Counter 1" },
  { token: "DXB-141", type: "Payment", customer: "Ahmed Kareem", wait: "2m", status: "In Service", desk: "Cashier" },
  { token: "DXB-142", type: "Pickup", customer: "S. Ahmed", wait: "22m", status: "Waiting", desk: "Counter 2" },
];

export const quotations = [
  { no: "QT-901", customer: "Areej Motors", total: "AED 8,700", validity: "2026-03-21", status: "Shared" },
  { no: "QT-902", customer: "M. Al Nuaimi", total: "AED 1,920", validity: "2026-03-18", status: "Accepted" },
  { no: "QT-903", customer: "Starline Garage", total: "AED 5,300", validity: "2026-03-15", status: "Revised" },
];

export const payments = [
  { ref: "PAY-6001", order: "ORD-2301", mode: "Card", amount: "AED 1,150", status: "Paid", cashier: "Omar" },
  { ref: "PAY-6002", order: "ORD-2302", mode: "Bank Transfer", amount: "AED 2,000", status: "Partial", cashier: "Layla" },
  { ref: "PAY-6003", order: "ORD-2299", mode: "Cash", amount: "AED 480", status: "Refunded", cashier: "Omar" },
];

export const agents = [
  { name: "Fatima Noor", enquiries: 23, quotes: 15, converted: 11, revenue: "AED 74,200" },
  { name: "Yousef Adel", enquiries: 19, quotes: 11, converted: 8, revenue: "AED 52,100" },
  { name: "Reem Tariq", enquiries: 26, quotes: 17, converted: 13, revenue: "AED 81,500" },
];

export const reports = [
  { metric: "Quote to Order Conversion", value: "62%", note: "+4% vs last week" },
  { metric: "Average Token Wait", value: "11 mins", note: "Target < 12 mins" },
  { metric: "Repeat Customer Rate", value: "38%", note: "Strong B2B repeat" },
  { metric: "Lost Leads (Price)", value: "14", note: "Top loss reason" },
];
