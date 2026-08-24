import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Daan Taheij — Grafisch Vormgever",
  description:
    "Portfolio van Daan Taheij, grafisch vormgever bij UP International. Werkt op het snijvlak van vormgeving, technologie en AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nl"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-paper text-ink font-sans antialiased">
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <Cursor />
            <Navbar />
            {children}
          </SmoothScroll>
        </MotionConfig>
      </body>
    </html>
  );
}
