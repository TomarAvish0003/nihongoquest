import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar"; // 1. IMPORT THE NAVBAR
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
  title: "NihonQuest | Master Japanese",
  description: "Gamified Japanese learning platform",
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
      <body className="min-h-full flex flex-col bg-slate-950">
        <AuthProvider>
          {/* 2. PLACE THE NAVBAR INSIDE THE AUTHPROVIDER */}
          <Navbar />
          
          {/* 3. WRAP CHILDREN IN A FLEX CONTAINER TO PUSH FOOTER DOWN IF NEEDED */}
          <div className="flex-grow">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}