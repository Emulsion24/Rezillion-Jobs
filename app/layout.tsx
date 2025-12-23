import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Inter is excellent for readability in job listings and forms
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobFlow | Find Your Next Career Move",
  description: "Connect with top employers and find your dream job in tech, marketing, and design.",
  keywords: ["jobs", "careers", "hiring", "employment", "remote work"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${inter.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans 
          antialiased 
          text-slate-900 
          bg-white
        `}
      >
        {children}
      </body>
    </html>
  );
}