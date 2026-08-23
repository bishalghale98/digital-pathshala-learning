import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";

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
    default: "BISAN LMS - Online Learning Platform",
    template: "%s | BISAN LMS",
  },
  description:
    "Learn practical skills through structured online courses. BISAN LMS helps you track progress, explore categories, and grow your knowledge at your own pace.",
  keywords: ["online learning", "courses", "education", "LMS", "e-learning", "BISAN"],
  openGraph: {
    title: "BISAN LMS - Online Learning Platform",
    description:
      "Learn practical skills through structured online courses. Track progress and grow your knowledge.",
    type: "website",
    siteName: "BISAN LMS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
