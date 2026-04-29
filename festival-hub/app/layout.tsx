import type { Metadata, Viewport } from "next"; // Added Viewport
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

// 1. Setup the Metadata for the PWA
export const metadata: Metadata = {
  title: "SQUAD HUB",
  description: "Festival survival and squad coordination.",
  manifest: "/manifest.json", // This links your public/manifest.json
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SQUAD HUB",
  },
};

// 2. Setup the Viewport (Theme color for the phone's status bar)
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <head>
        {/* Manual fallback for older iPhones */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}