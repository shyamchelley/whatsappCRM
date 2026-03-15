import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mercedes-Benz Spare Parts CRM",
  description: "Sales, token, order and payment operations CRM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
