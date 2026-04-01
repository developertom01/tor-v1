import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThorAI — Put Your Business Online With Confidence",
  description:
    "ThorAI gives vendors across West Africa a fully verified online store in minutes — and gives buyers the confidence to shop without fear.",
  keywords: ["e-commerce", "Africa", "Ghana", "Nigeria", "verified vendor", "online store", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
