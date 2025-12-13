/** @format */

"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger />
            <AdminHeader />
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
