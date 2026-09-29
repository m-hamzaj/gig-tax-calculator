import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gig Tax Estimator — 1099 Self-Employment Tax Calculator",
  description:
    "Free self-employment tax estimator for gig workers and freelancers. Estimate your 1099 self-employment tax, federal income tax, and quarterly payments — with a plain-English AI explanation of your numbers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning on both tags: browser extensions (Grammarly,
          quote/quick-bar extensions, etc.) inject data-* attributes into
          <html>/<body> before React hydrates -- a real, common, and
          harmless mismatch that isn't caused by anything in this app's own
          code. This only suppresses the warning for these two elements'
          own attributes, not for any real content mismatch inside them. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
