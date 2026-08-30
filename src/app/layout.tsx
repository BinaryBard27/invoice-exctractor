import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WelcomeToast from "@/components/WelcomeToast";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Invoice PDF to Excel Converter — PullInvoice",
  description: "PullInvoice extracts invoice data from PDF to Excel or CSV instantly. Parse vendor, date, totals and line items from any invoice. Free to try with no credit card needed.",
  metadataBase: new URL("https://pullinvoice.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "PullInvoice — Turn invoices into Excel",
    description: "Extract structured invoice data from PDFs in seconds.",
    type: "website",
    url: "https://pullinvoice.com",
    siteName: "PullInvoice",
  },
  twitter: { card: "summary_large_image", title: "PullInvoice — Turn invoices into Excel", description: "Extract structured invoice data from PDFs in seconds." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="pb-20 antialiased sm:pb-0" suppressHydrationWarning>
        <ClerkProvider>
          {children}
          <WelcomeToast />
          <CookieConsent />
        </ClerkProvider>
      </body>
    </html>
  );
}
