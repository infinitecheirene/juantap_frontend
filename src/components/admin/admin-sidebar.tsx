"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import ProfileModal from "@/components/profile/ProfileModal";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [paymentCount, setPaymentCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: Download,
      badge: paymentCount > 0 ? String(paymentCount) : null,
    },
    { name: "Templates", href: "/admin/templates", icon: FileText },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

 const getProfileImageUrl = (path?: string) => {
  if (!path) return "/placeholder.svg?height=40&width=40";
  if (path.startsWith("http")) return path;
  // Path already includes 'avatars/' prefix from backend
  return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${path}`;
};
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      handleLogout();
    }
  };

  const fetchPaymentCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/payments/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPaymentCount(data.pending || 0);
      }
    } catch (error) {
      console.error("Error fetching payments count:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPaymentCount();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // If you're storing user data
  localStorage.removeItem("auth_token"); // If another token is under a different key
  localStorage.clear(); // Optional: clears everything from localStorage

  sessionStorage.clear(); // Clears session storage

  setUser(null);
  router.replace("/login");
};


  return (
    <>
      {/* Optional mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed z-50 top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          isOpen ? "block" : "hidden",
          "md:block"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-semibold text-gray-700">
            {!collapsed && "Admin Panel"}
          </span>
          <div className="flex items-center gap-2">
            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hidden md:flex"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile close */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-colors",
                      collapsed 
                        ? "justify-center p-3" 
                        : "space-x-3 px-3 py-2",
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)} // close sidebar on mobile
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <Badge variant="destructive" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer: Profile + Logout */}
        <div className="border-t border-gray-200 p-4">
          {/* Profile Section */}
          <div
            className={cn(
              "flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition",
              collapsed 
                ? "justify-center p-2" 
                : "space-x-3 p-2"
            )}
            onClick={() => setProfileModalOpen(true)}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={getProfileImageUrl(user?.profile_image)} />
              <AvatarFallback>
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n: string) => n[0]?.toUpperCase())
                      .join("")
                  : "AD"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.display_name || ""}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button - Positioned below profile */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex items-center transition-all",
                collapsed 
                  ? "justify-center p-2" 
                  : "justify-start px-3 py-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>

        {/* Profile Modal */}
        <ProfileModal
          open={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          refreshUser={fetchUserData}
        />
      </div>
    </>
  );
}