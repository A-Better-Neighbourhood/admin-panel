/** @format */

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/main-layout";

const notoSans = Noto_Sans({ variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Admin Panel - Issue Management",
  description: "Admin dashboard for managing public issues and reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(notoSans.variable + " antialiased", notoSans.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
