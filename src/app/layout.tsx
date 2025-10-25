import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "นาฬิกาดิจิทัล - ห้องสอบ",
  description: "นาฬิกาดิจิทัลสำหรับการแสดงเวลาในห้องสอบ",
  openGraph: {
    title: "นาฬิกาดิจิทัล - ห้องสอบ",
    description: "นาฬิกาดิจิทัลสำหรับการแสดงเวลาในห้องสอบ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
