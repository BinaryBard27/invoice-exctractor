import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WelcomeToast from "@/components/WelcomeToast";

export const metadata: Metadata = {
  title: "Invoice PDF to Excel Converter — Free Invoice Data Extractor",
  description: "Extract invoice data from PDF to Excel or CSV instantly. Parse vendor, date, totals and line items from any invoice. First 3 free.",
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
