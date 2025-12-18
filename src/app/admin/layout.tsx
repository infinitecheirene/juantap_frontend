"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen}
        collapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <main 
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile toggle button */}
        <div className="md:hidden mb-4">
          <Button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4 mr-2" />
            Open Menu
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}