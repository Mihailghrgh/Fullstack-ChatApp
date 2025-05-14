import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ShadCnThemeProvider from "./providers";
import QueryProvider from "./QueryProvider/QueryProvider";
import { SocketProvider } from "@/components/SocketProvider/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Io",
  description: "Application for chatting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          cz-shortcut-listen="true"
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            {/* <SocketProvider/> */}
            <ShadCnThemeProvider>{children}</ShadCnThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
