import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AppProviders } from "@/components/providers/AppProviders";
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
  title: {
    default: "TypeAlgo — Algorithmic Fluency Training",
    template: "%s · TypeAlgo",
  },
  description:
    "Type something that matters. Procedural fluency training — implementation cognition, not problem dumps.",
  applicationName: "TypeAlgo",
  openGraph: {
    title: "TypeAlgo",
    description: "Algorithmic fluency training. Type, Recall, Review, Sprint.",
    siteName: "TypeAlgo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TypeAlgo",
    description: "Implementation cognition, not problem dumps.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>
          <Header />
          <div className="app-main flex flex-1 flex-col">{children}</div>
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
