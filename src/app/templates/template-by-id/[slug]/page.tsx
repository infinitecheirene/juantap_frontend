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
    const isPremium = template.category === "premium";
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/");
            return;
        }

        const user = JSON.parse(userData);
        if (!user.is_admin) {
            router.push(`/templates/template-by-id/${params.slug}`);
        } else {
            router.push("/admin/");
        }
    }, [router, params.slug]);

    return (
        <header className="bg-white border-b sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Link href="/templates">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Templates
                            </Button>
                        </Link>

                        <div>
                            <h1 className="text-2xl font-bold">{template.name}</h1>
                            <div className="flex gap-2 mt-1">
                                {isPremium && (
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                        <Crown className="w-3 h-3 mr-1" /> Premium
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

                    <div>
                        {isPremium ? (
                            <span className="text-2xl font-bold">₱{template.price}</span>
                        ) : (
                            <span className="text-2xl font-bold text-green-600">Free</span>
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
function TemplatePreviewSidebar({ template }: { template: Template }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const isPremium = template.category === "premium";

    const handleAction = () => {
        if (isPremium) setShowPaymentModal(true);
        else toast.success("Template saved!");
    };

    return (
        <>
            <Toaster position="top-center" richColors />

            <Card className="p-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isPremium && <Crown className="w-5 h-5 text-yellow-600" />}
                        {isPremium ? "Premium Template" : "Free Template"}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Button
                        onClick={handleAction}
                        disabled={isSaving}
                        className="w-full"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        <Download className="w-4 h-4 mr-2" />
                        {isPremium ? "Purchase Template" : "Save Template"}
                    </Button>
                </CardContent>
            </Card>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                template={template}
                onPaymentSuccess={() => {
                    setShowPaymentModal(false);
                    toast.success("Payment successful!");
                }}
            />
        </>
    );
}

/* PAGE COMPONENT */
export interface Props {
    params: {
        slug: string;
    };
}

export default function TemplatePage({ params }: Props) {
    const { slug } = params; // ✅ direct access

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

    // 🔄 Fetch template
    useEffect(() => {
        if (!slug) return;

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (res.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                    return;
                }

                if (!res.ok) throw new Error("User fetch failed");

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

    // 🌀 Loading
    if (isAuthenticated === null || loading) {
        return <Loading />;
    }

    if (!template) {
        return <div className="p-6 text-center text-gray-600">Template not found.</div>;
    }

    return (
        <>
            <header className="w-full bg-gray-50 px-6 py-4 shadow-sm">
                <TemplatePreviewHeader template={template} />
            </header>

            <div className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 p-6">
                    <main className="flex-1">
                        <TemplateCard
                            template={template}
                            user={user}
                            slug={slug}
                            className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5"
                        />

                        <div className="mt-8">
                            <TemplatePreviewContent template={template} />
                        </div>
                    </main>

                    <aside className="w-full lg:w-80">
                        <TemplatePreviewSidebar template={template} />
                    </aside>
                </div>
            </div>
        </>
    );
}

