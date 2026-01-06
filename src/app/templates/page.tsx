"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TemplateGallery } from "@/components/templates/template-gallery";
import { TemplateHeader } from "@/components/templates/template-header";
import { getAllTemplates } from "@/lib/template-data";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Files, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center">
        <span className="text-white font-serif font-bold text-sm">JT</span>
      </div>
      <span
        className={cn(
          "text-xl font-bold",
          variant === "light"
            ? "bg-gradient-to-r from-cyan-500 to-indigo-300 bg-clip-text text-transparent"
            : "text-white"
        )}
      >
        JuanTap
      </span>
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hash, setHash] = useState("");
  const [loadingNav, setLoadingNav] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (path: string) => {
    setLoadingNav(path);
    router.push(path);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    setIsLoggedIn(true);

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);

        // Optional: force logout if token is invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const getProfileImageUrl = (path?: string) => {
    if (!path) return "/placeholder.svg?height=40&width=40";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/storage/${path}`;
  };

  const handleLogout = async () => {
    setLoadingAction("logout");
    setTimeout(() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      setLoadingAction(null);
      router.push("/login");
    }, 300);
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/" && hash === "";
    return pathname.startsWith(path);
  };

  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const data = await getAllTemplates();
      setTemplates(data);
    };
    fetchTemplates();
  }, []);

  return (
    <main>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />

          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavClick("/")}
                className={`transition-colors flex items-center space-x-1 ${
                  isActive("/")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Home</span>
                {loadingNav === "/" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </button>

              <button
                onClick={() => handleNavClick("/templates")}
                className={`transition-colors ${
                  isActive("/templates")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                } flex items-center space-x-1`}
              >
                <span>Templates</span>
                {loadingNav === "/templates" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getProfileImageUrl(user?.profile_image)}
                        alt="Profile"
                      />
                      <AvatarFallback>
                        {user?.name ? (
                          user.name
                            .split(" ")
                            .map((n: string) => n[0]?.toUpperCase()) // <-- add ': string' here
                            .join("")
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    asChild
                    onClick={() => setLoadingItem("editProfile")}
                  >
                    <Link
                      href="/dashboard/edit-profile"
                      className="flex items-center space-x-2"
                    >
                      {loadingItem === "editProfile" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={(e) => {
                      if (!user?.username) {
                        e.preventDefault();
                        alert("Set a username first in Edit Profile.");
                        return;
                      }
                      setLoadingItem("viewProfile");
                      router.push(`/${user.username}`);
                    }}
                    className={
                      !user?.username
                        ? "cursor-not-allowed opacity-50"
                        : "flex items-center space-x-2"
                    }
                  >
                    {loadingItem === "viewProfile" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>View Public Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    onClick={() => setLoadingItem("myTemplates")}
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2"
                    >
                      {loadingItem === "myTemplates" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Files className="h-4 w-4" />
                      )}
                      <span>My Templates</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Link href="/login" onClick={() => setLoadingAction("login")}>
                  <Button
                    variant="outline"
                    disabled={loadingAction === "login"}
                  >
                    {loadingAction === "login" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setLoadingAction("register")}
                >
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loadingAction === "register"}
                  >
                    {loadingAction === "register" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <Button
                size="sm"
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loadingAction === "logout"}
              >
                {loadingAction === "logout" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Logout"
                )}
              </Button>
            )}
          </div>
        </div>
      </header>
      <TemplateHeader />
      <TemplateGallery templates={templates} />
    </main>
  );
}
