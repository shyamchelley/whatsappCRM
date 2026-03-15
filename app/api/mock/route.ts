import { NextResponse } from "next/server";
import { agents, customers, kpis, leads, orders, payments, quotations, reports, tokens } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    kpis,
    leads,
    customers,
    orders,
    tokens,
    quotations,
    payments,
    agents,
    reports,
  });
}
