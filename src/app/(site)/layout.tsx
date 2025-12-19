"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TermsModal } from "@/app/TermsModal";
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // ✅ Move all hooks **inside** the component
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
    const cachedUser = localStorage.getItem("user");

    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Invalid cached user:", e);
      }
    } else if (token) {
      setIsLoggedIn(true);
    }

    if (token) {
      const fetchUser = async () => {
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
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
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
      localStorage.removeItem("user");
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

  const footerSections = [
    {
      title: "Product",
      links: [
        { href: "#", label: "Features" },
        { href: "#", label: "Templates" },
        { href: "#", label: "Pricing" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Contact Us" },
      ],
    },
    {
      title: "User Agreement",
      links: [{ href: "#", label: "Terms of Service" }],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      {children}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo variant="dark" />
              </div>
              <p className="text-purple-200/80">
                Create and share your digital profile with the world. One tap,
                endless possibilities.
              </p>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-purple-200/70">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.label === "Terms of Service" ? (
                        <TermsModal />
                      ) : (
                        <Link
                          href={link.href}
                          className="hover:text-pink-200 transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-purple-200/60">
            <p>&copy; 2025 JuanTap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
