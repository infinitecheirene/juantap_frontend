"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";

import type { Template } from "@/lib/template-data";
import type { User } from "@/types/template";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loading } from "@/components/loading";

import { TemplateCard } from "@/components/templates/template-card-2";
import { PaymentModal } from "@/components/templates/payment-modal";
import type { Template as TemplateType, User as UserType } from "@/types/template";

import {
    ArrowLeft,
    Crown,
    Star,
    Sparkles,
    Palette,
    Type,
    Layout,
    Smartphone,
    Download,
    Share2,
    CheckCircle,
    Loader2,
} from "lucide-react";

import { toast, Toaster } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye, Files, User2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const defaultColors = {
    primary: "#1f2937",
    secondary: "#6b7280",
    accent: "#3b82f6",
    background: "#ffffff",
    text: "#111827",
};

const defaultFonts = {
    heading: "Inter",
    body: "Inter",
};

/* HEADER */
function TemplatePreviewHeader({ template }: { template: Template }) {
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hash, setHash] = useState("");
    const [loadingNav, setLoadingNav] = useState<string | null>(null);
    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
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

    const isPremium = template.category === "premium";
    const router = useRouter();


    return (
        <header className="sticky top-0 z-2">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Link href="/templates">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Templates
                            </Button>
                        </Link>

                        <div className="flex">
                            <h1 className="text-2xl font-bold mr-3">{template.name}</h1>
                            <div className="flex gap-2 mt-1">
                                {isPremium ? (
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                        <Crown className="w-3 h-3 mr-1" /> Premium
                                    </Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-700">
                                        Free Template
                                    </Badge>
                                )}

                                {template.isNew && (
                                    <Badge className="bg-green-100 text-green-700">
                                        <Sparkles className="w-3 h-3 mr-1" /> New
                                    </Badge>
                                )}

                                {template.isPopular && (
                                    <Badge className="bg-yellow-100 text-yellow-700">
                                        <Star className="w-3 h-3 mr-1" /> Popular
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

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
                                                    <User2 className="h-5 w-5 text-gray-500" />
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
            </div>
        </header>
    );
}

/* CONTENT */
function TemplatePreviewContent({ template }: { template: Template }) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold">Color Palette</h3>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {Object.entries(template.colors ?? {}).map(([key, value]) => (
                            <div key={key} className="text-center">
                                <div
                                    className="w-12 h-12 rounded-lg border mx-auto mb-1"
                                    style={{ backgroundColor: value }}
                                />
                                <span className="text-xs capitalize">{key}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Type className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Typography</h3>
                    </div>

                    <p style={{ fontFamily: template.fonts?.heading }}>
                        Heading: {template.fonts?.heading ?? "N/A"}
                    </p>
                    <p style={{ fontFamily: template.fonts?.body }}>
                        Body: {template.fonts?.body ?? "N/A"}
                    </p>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Layout className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Features</h3>
                </div>

                {(template.features ?? []).length > 0 ? (
                    (template?.features ?? []).map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{feature}</span>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500">No features listed</span>
                )}
            </Card>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold">Tags</h3>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {(template.tags ?? []).length > 0 ? (
                        (template?.tags ?? []).map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-gray-500">No tags</span>
                    )}
                </div>
            </Card>
        </div>
    );
}

/* SIDEBAR */

interface TemplatePreviewSidebarProps {
    template: Template;
}

export function TemplatePreviewSidebar({
    template,
}: TemplatePreviewSidebarProps) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    // Separate loading states
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [isTogglingUsed, setIsTogglingUsed] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Backend statuses
    const [savedStatus, setSavedStatus] = useState<
        "saved" | "bought" | "pending" | "free" | null
    >(template.category === "premium" ? null : "free");
    const [usedStatus, setUsedStatus] = useState<"used" | "unused">("unused");

    const isPremium = template.category === "premium";
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const pathname = usePathname();

    const authHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    // --- Fetch initial statuses ---
    useEffect(() => {
        const fetchSavedTemplates = async () => {
            try {
                const res = await fetch(`${API_URL}/templates1/saved`, {
                    headers: authHeaders(),
                });
                if (!res.ok) throw new Error("Failed to fetch saved templates");
                const data = await res.json();
                const found = data.find((t: any) => t.slug === template.slug);
                if (found) setSavedStatus(found.status);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchBoughtedTemplates = async () => {
            try {
                const res = await fetch(`${API_URL}/templates1/boughted`, {
                    headers: authHeaders(),
                });
                if (!res.ok) throw new Error("Failed to fetch bought templates");
                const result = await res.json();
                const bought = result.data || [];
                const found = bought.find((t: any) => t.slug === template.slug);
                if (found) setSavedStatus(found.status);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchUsedTemplates = async () => {
            try {
                const res = await fetch(`${API_URL}/templates1/used`, {
                    headers: authHeaders(),
                });
                if (!res.ok) throw new Error("Failed to fetch used templates");
                const data = await res.json();
                const isUsed = data.some((t: any) => t.slug === template.slug);
                setUsedStatus(isUsed ? "used" : "unused");
            } catch (err) {
                console.error(err);
            }
        };

        Promise.all([
            fetchSavedTemplates(),
            fetchBoughtedTemplates(),
            fetchUsedTemplates(),
        ]).finally(() => setIsLoadingStatus(false));
    }, [API_URL, template.slug]);

    // --- Actions ---
    const saveTemplate = async () => {
        setIsSavingTemplate(true);
        try {
            const res = await fetch(`${API_URL}/templates/saved/${template.slug}`, {
                method: "POST",
                headers: authHeaders(),
            });

            if (!res.ok) throw new Error("Failed to save template");
            toast.success("Template saved!");
            setSavedStatus("saved");
        } catch {
            toast.error("Error saving template");
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const unsaveTemplate = async () => {
        setIsSavingTemplate(true);
        try {
            const res = await fetch(`${API_URL}/templates/saved/${template.slug}`, {
                method: "DELETE",
                headers: authHeaders(),
            });

            if (!res.ok) throw new Error("Failed to unsave template");
            toast.success("Template removed from saved.");
            setSavedStatus("free");
        } catch {
            toast.error("Error removing template");
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const markUsed = async () => {
        setIsTogglingUsed(true);
        try {
            const res = await fetch(`${API_URL}/templates/used/${template.slug}`, {
                method: "POST",
                headers: authHeaders(),
            });

            if (!res.ok) throw new Error("Failed to mark as used");
            toast.success("Template marked as used!");
            setUsedStatus("used");
        } catch {
            toast.error("Error marking template as used");
        } finally {
            setIsTogglingUsed(false);
        }
    };

    const markUnused = async () => {
        setIsTogglingUsed(true);
        try {
            const res = await fetch(`${API_URL}/templates/used/${template.slug}`, {
                method: "DELETE",
                headers: authHeaders(),
            });

            if (!res.ok) throw new Error("Failed to mark as unused");
            toast.success("Template marked as unused.");
            setUsedStatus("unused");
        } catch {
            toast.error("Error marking template as unused");
        } finally {
            setIsTogglingUsed(false);
        }
    };

    const toggleUsed = () => (usedStatus === "used" ? markUnused() : markUsed());

    const handleShare = async () => {
        setIsSharing(true);
        const url = `${window.location.origin}/templates/${template.slug}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${template.name} Template - JuanTap`,
                    text: template.description,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast.success("Template link copied!");
            }
        } catch {
            console.log("Share cancelled");
        } finally {
            setIsSharing(false);
        }
    };

    const handleGetTemplate = () => {
        if (isPremium) {
            if (savedStatus === "bought") {
                toast.info("You already own this template.");
            } else if (savedStatus === "pending") {
                toast.info("Payment pending approval.");
            } else {
                setIsPurchasing(true); // Start loader
                setShowPaymentModal(true);
            }
        } else {
            savedStatus === "saved" ? unsaveTemplate() : saveTemplate();
        }
    };


    return (
        <>
            <Toaster position="top-center" richColors />

            <div className="space-y-6 mt-2">
                {/* Purchase Card */}
                <Card className="p-4 mx-6 lg:mx-0">
                    <CardHeader className="flex items-center gap-2">
                        <CardTitle className="flex items-center gap-2">
                            {isPremium && <Crown className="w-5 h-5 text-yellow-600" />}
                            {isPremium ? "Premium Template" : "Free Template"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="text-center">
                            {isPremium ? (
                                <>
                                    <span className="text-3xl font-bold text-gray-900">
                                        ₱{template.price}
                                    </span>
                                    {template.originalPrice && (
                                        <span className="ml-2 text-xl text-gray-500 line-through">
                                            ₱{template.originalPrice}
                                        </span>
                                    )}
                                    <p className="text-sm text-gray-600">One-time payment</p>
                                </>
                            ) : (
                                <>
                                    <span className="text-3xl font-bold text-green-600">
                                        Free
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        {savedStatus === "saved"
                                            ? "Already saved"
                                            : "No payment required"}
                                    </p>
                                </>
                            )}
                        </div>

                        <Button
                            onClick={handleGetTemplate}
                            disabled={isSavingTemplate || isPurchasing || isLoadingStatus} // <-- add isLoadingStatus here
                            className={`w-full mt-4 ${isPremium
                                    ? savedStatus === "pending"
                                        ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    : savedStatus === "saved"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            size="lg"
                        >
                            {(isSavingTemplate || isPurchasing) && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            <Download className="w-4 h-4" />
                            {isPremium
                                ? savedStatus === "bought"
                                    ? "Owned"
                                    : savedStatus === "pending"
                                        ? "Pending Approval"
                                        : "Purchase Template"
                                : savedStatus === "saved"
                                    ? "Unsave"
                                    : "Save Free"}
                        </Button>

                        {/* Used/Unused toggle */}
                        {(savedStatus === "saved" || savedStatus === "bought") && (
                            <Button
                                onClick={toggleUsed}
                                disabled={isTogglingUsed}
                                className={`w-full ${usedStatus === "used"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                size="lg"
                            >
                                {isTogglingUsed && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {usedStatus === "used" ? "Mark as Unused" : "Mark as Used"}
                            </Button>
                        )}

                        <div className="flex gap-2 mb-4">
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                disabled={isSharing}
                                className="w-full flex-1"
                            >
                                {isSharing && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="p-4 mx-6 lg:mx-0">
                    <CardHeader>
                        <CardTitle>Template Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Category</span>
                            <Badge className="px-4 pb-1 mt-1 rounded-lg" variant={isPremium ? "default" : "secondary"}>
                                {isPremium ? "Premium" : "Free"}
                            </Badge>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Layout Style</span>
                            <span className="font-medium capitalize">{template.layout}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium extra info */}
                {isPremium && (
                    <Card>
                        <CardHeader>
                            <CardTitle>What's Included</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {[
                                "Premium design",
                                "Full customization",
                                "Responsive layout",
                                "Priority support",
                                "Lifetime updates",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 ml-4">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false);
                    setIsPurchasing(false); // Stop loader if modal closed
                }}
                template={template}
                onPaymentSuccess={() => {
                    setShowPaymentModal(false);
                    setSavedStatus("bought");
                    setIsPurchasing(false); // Stop loader
                    toast.success("Payment successful! Template unlocked.");
                }}
            />
        </>
    );
}

/* PAGE COMPONENT */
interface Props {
    params: Promise<{ slug: string }>;
}

export default function TemplatePage({ params }: Props) {
    const { slug } = use(params); // unwrap Promise

    const [template, setTemplate] = useState<TemplateType | null>(null);
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const router = useRouter();

    // 🔑 Check authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // 🔄 Fetch template data
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/templates/${slug}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw new Error("Template not found");
                const data = await res.json();

                setTemplate({
                    ...data,
                    colors: {
                        primary: data.colors?.primary ?? defaultColors.primary,
                        secondary: data.colors?.secondary ?? defaultColors.secondary,
                        accent: data.colors?.accent ?? defaultColors.accent,
                        background: data.colors?.background ?? defaultColors.background,
                        text: data.colors?.text ?? defaultColors.text,
                    },
                    fonts: {
                        heading: data.fonts?.heading ?? defaultFonts.heading,
                        body: data.fonts?.body ?? defaultFonts.body,
                    },
                    sections: data.sections ?? [],
                });
            } catch (err) {
                console.error("Error fetching template:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [slug]);

    // 🔄 Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                router.push("/login");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/user-profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                if (res.status === 401) {
                    // token invalid or expired
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error(`User fetch failed: ${res.status}`);
                }

                const data = await res.json();

                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    is_admin: data.is_admin,
                    avatar_url: data.avatar_url,
                    profile: {
                        bio: data.profile?.bio ?? "",
                        phone: data.profile?.phone ?? "",
                        avatar: data.profile?.avatar ?? data.avatar_url ?? "",
                        website: data.profile?.website ?? "",
                        location: data.profile?.location ?? "",
                        socialLinks: data.profile?.socialLinks ?? [],
                    },
                });
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null);
            }
        };

        fetchUser();
    }, [router]);


    // 🌀 Show loading state using custom Loading component
    if (isAuthenticated === null || loading) {
        return <Loading />;
    }

    if (!template) {
        return (
            <div className="p-6 text-center text-gray-600">Template not found.</div>
        );
    }

    return (
        <>
            {/* Background wrapper with gradient + orbs */}
            <main className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
                {/* Animated orbs */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
                    <div className="absolute top-20 right-20 w-1 h-1 bg-purple-700 rounded-full animate-ping"></div>
                    <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-600 rounded-full animate-bounce"></div>
                    <div className="absolute top-1/2 right-10 w-2 h-2 bg-blue-700 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-gray-800 rounded-full animate-ping delay-500"></div>
                </div>

                {/* Soft blurred circles */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <header className="w-full bg-gray-50 px-6 py-4 shadow-sm">
                    <TemplatePreviewHeader template={template} />
                </header>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    <main className="flex-1">
                        <TemplateCard template={template} user={user} slug={slug}
                            className="mb-6 p-6 bg-white/80 backdrop-blur-sm" />
                        <div className="mt-8">
                            <TemplatePreviewContent template={template} />
                        </div>
                    </main>

                    <aside className="w-full lg:w-80">
                        <TemplatePreviewSidebar template={template} />
                    </aside>
                </div>
            </main>
        </>
    );
}
