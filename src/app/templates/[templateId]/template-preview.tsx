"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";

import type { Template } from "@/lib/template-data";
import type { User } from "@/types/template";

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
    Palette,
    Type,
    Layout,
    Smartphone,
    Download,
    Share2,
    CheckCircle,
} from "lucide-react";

import { toast, Toaster } from "sonner";

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


"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

import type { Template } from "@/lib/template-data"
import type { User } from "@/types/template"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    ArrowLeft,
    Crown,
    Sparkles,
    Star,
    Eye,
    Edit,
    Files,
    User2,
    Loader2,
} from "lucide-react"

{/* HEADER */ }
export default function TemplatePreviewHeader({
    template,
    user,
}: {
    template: Template
    user: User | null
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [loadingItem, setLoadingItem] = useState<string | null>(null)

    // 🔕 Do NOT render header on public profile pages
    if (/^\/[^/]+$/.test(pathname)) {
        return null
    }

    const isPremium = template.category === "premium"
    const isLoggedIn = !!user

    const profileImage =
        user?.profile_image?.startsWith("http")
            ? user.profile_image
            : user?.profile_image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/storage/${user.profile_image}`
                : "/placeholder.svg"

    return (
        <header className="bg-white border-b sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/templates">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>

                    <h1 className="text-2xl font-bold">{template.name}</h1>

                    <div className="flex gap-2">
                        {isPremium ? (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                <Crown className="w-3 h-3 mr-1" /> Premium
                            </Badge>
                        ) : (
                            <Badge className="bg-blue-100 text-blue-700">Free</Badge>
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

                {isLoggedIn && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarImage src={profileImage} />
                                    <AvatarFallback>
                                        {user?.name
                                            ? user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                            : <User2 />}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/edit-profile">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link
                                    href={user?.username ? `/${user.username}` : "#"}
                                    onClick={(e) => {
                                        if (!user?.username) {
                                            e.preventDefault()
                                            alert("Set a username first.")
                                            return
                                        }
                                        setLoadingItem("profile")
                                    }}
                                >
                                    {loadingItem === "profile" ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Eye className="w-4 h-4 mr-2" />
                                    )}
                                    View Public Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <Files className="w-4 h-4 mr-2" />
                                    My Templates
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    )
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