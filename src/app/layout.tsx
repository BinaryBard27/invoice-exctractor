import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WelcomeToast from "@/components/WelcomeToast";

export const metadata: Metadata = {
  title: "Invoice PDF to Excel Converter — PullInvoice",
  description: "PullInvoice extracts invoice data from PDF to Excel or CSV instantly. Parse vendor, date, totals and line items from any invoice. Free to try with no credit card needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ClerkProvider>
          {children}
          <WelcomeToast />
        </ClerkProvider>
      </body>
    </html>
  );
}
