import type { Metadata } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["300", "400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ardamol.com"),
  title: {
    default: "Arda Mol — The Castle of Ideas",
    template: "%s — Arda Mol",
  },
  description:
    "Thoughts, stories, projects and experiments. A personal record of things learned and built.",
  openGraph: {
    title: "Arda Mol — The Castle of Ideas",
    description: "Thoughts, stories, projects and experiments.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
