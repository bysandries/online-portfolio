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
  title: "Luis Bedoya Sandries — Full-Stack & Cloud Developer",
  description:
    "Interactive portfolio of Luis Bedoya Sandries: full-stack and cloud projects with live, in-page demos — from a statewide affordable-housing search engine to an in-browser Java IDE running on WASM.",
  metadataBase: new URL("https://sandries.com"),
  openGraph: {
    title: "Luis Bedoya Sandries — Full-Stack & Cloud Developer",
    description:
      "Interactive portfolio with live, in-page project demos. Seattle, WA · Bilingual EN/ES.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
