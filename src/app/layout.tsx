import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "TypeAlgo — Algorithmic Fluency Training",
    template: "%s · TypeAlgo",
  },
  description:
    "Type something that matters. Procedural fluency training — implementation cognition, not problem dumps.",
  applicationName: "TypeAlgo",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProviders>
          <Header />
          <div className="app-main flex flex-1 flex-col">{children}</div>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
