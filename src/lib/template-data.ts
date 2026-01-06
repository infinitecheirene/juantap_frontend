import axios from "axios";

import type { Template, User } from "@/types/template";

// Re-export Template for backward compatibility with imports from @/lib/template-data
export type { Template };
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL!;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

// Helper: normalize social links (API may return JSON string, array, and isVisible as number)
function normalizeSocialLinks(raw: any): any[] {
  if (!raw) return [];
  let items: any[] = [];
  if (typeof raw === "string") {
    try {
      items = JSON.parse(raw);
    } catch (e) {
      return [];
    }
  } else if (Array.isArray(raw)) {
    items = raw;
  } else if (raw && Array.isArray(raw.social_links)) {
    items = raw.social_links;
  }

  return items.map((s) => ({
    id: s.id ?? String(s.platform) ?? Math.random().toString(36).slice(2),
    platform: s.platform ?? s.name ?? "",
    username: s.username ?? "",
    url: s.url ?? s.link ?? "",
    isVisible: Boolean(s.isVisible ?? s.is_visible ?? s.visible ?? (s.isVisible === 1 || s.is_visible === 1)),
  }));
}

function normalizeUser(raw: any): User | null {
  if (!raw) return null;

  // Normalize avatar
  let avatarUrl = "/default-avatar.png";
  if (raw.profile_image) {
    const cleanPath = String(raw.profile_image).replace(/^storage\//, "");
    avatarUrl = `${IMAGE_URL.replace(/\/$/, "")}/storage/${cleanPath}`;
  }

  const socialLinks = normalizeSocialLinks(raw.profile?.social_links ?? raw.profile?.socialLinks ?? raw.social_links ?? raw.socialLinks);

  return {
    id: raw.id,
    name: raw.name,
    username: raw.username,
    email: raw.email,
    is_admin: raw.is_admin ?? false,
    avatar_url: avatarUrl,
    display_name: raw.display_name ?? raw.name,
    social_links: raw.social_links ?? raw.socialLinks,
    profile: {
      bio: raw.profile?.bio ?? "",
      phone: raw.profile?.phone ?? "",
      avatar: raw.profile?.avatar ?? avatarUrl,
      website: raw.profile?.website ?? "",
      location: raw.profile?.location ?? "",
      socialLinks,
    },
  } as User;
}

function normalizeTemplate(raw: any): Template {
  if (!raw) return raw;

  const user = raw.user ? normalizeUser(raw.user) : undefined;

  return {
    ...raw,
    // snake_case -> camelCase aliases
    isPremium: raw.is_premium ?? raw.isPremium,
    price: raw.price ?? raw.price,
    original_price: raw.original_price ?? raw.originalPrice ?? raw.original_price,
    originalPrice: raw.original_price ?? raw.originalPrice,
    previewUrl: raw.preview_url ?? raw.previewUrl,
    preview_url: raw.preview_url ?? raw.previewUrl,
    thumbnail: raw.thumbnail_url ?? raw.thumbnail,
    thumbnail_url: raw.thumbnail_url ?? raw.thumbnail,
    socialStyle: raw.social_style ?? raw.socialStyle,
    social_style: raw.social_style ?? raw.socialStyle,
    connectStyle: raw.connection_style ?? raw.connectStyle,
    connection_style: raw.connection_style ?? raw.connectStyle,
    isPopular: raw.is_popular ?? raw.isPopular ?? Boolean(raw.is_popular),
    isNew: raw.is_new ?? raw.isNew ?? Boolean(raw.is_new),
    isActive: raw.is_active ?? raw.isActive ?? Boolean(raw.is_active),
    // normalize user.profile.socialLinks
    user: user ? { ...user, profile: { ...user.profile, socialLinks: normalizeSocialLinks(user.profile?.socialLinks ?? []) } } : raw.user,
  } as Template;
}

// ✅ Fetch templates (authenticated if token exists)
export async function fetchTemplates(): Promise<Template[]> {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await axios.get(`${API_URL}/templates`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    // Adjust this depending on backend response and normalize each template
    const raw = response.data.templates ?? response.data ?? [];
    return Array.isArray(raw) ? raw.map(normalizeTemplate) : [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

// ✅ Fetch all templates (no auth)
export async function getAllTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_URL}/templates`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeTemplate) : [];
}

// ✅ Fetch template by slug
export async function getTemplateBySlug(slug: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Template not found");
  const data = await res.json();
  return normalizeTemplate(data);
}

// ✅ Fetch template by ID
export async function getTemplateById(id: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Template not found");
  const data = await res.json();
  return normalizeTemplate(data);
}

// ✅ Get current user (with profile + socials, normalized avatar URL)
export async function getCurrentUser(): Promise<User | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Use normalizer so we handle social links and avatar consistently
    return normalizeUser(data);
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

// src/lib/template-data.ts
export async function getUserTemplatesWithStatus(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates2`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error("Failed to fetch user's templates with status");

    return await res.json();
  } catch (err) {
    console.error("Error fetching templates with status:", err);
    return [];
  }
}

export async function fetchTemplatesWithStats(): Promise<Template[]> {
  try {
    const [templatesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/templates`, { cache: "no-store" }),
      fetch(`${API_URL}/stats/top-templates`, { cache: "no-store" }),
    ]);

    if (!templatesRes.ok || !statsRes.ok) {
      throw new Error("Failed to fetch templates or stats");
    }

    const templatesRaw = await templatesRes.json();
    const stats: any[] = await statsRes.json();

    const templates: Template[] = Array.isArray(templatesRaw) ? templatesRaw.map(normalizeTemplate) : [];

    return templates.map((tpl) => {
      const stat = stats.find((s) => s.id === tpl.id);
      return {
        ...tpl,
        unlocks: stat?.unlocks ?? 0,
        saves: stat?.saves ?? 0,
        revenue: stat?.revenue ?? 0,
      };
    });
  } catch (err) {
    console.error("Error fetching templates with stats:", err);
    return [];
  }
}

// Get saved templates
export async function getSavedTemplates(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates1/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch saved templates");

    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeTemplate) : [];
  } catch (err) {
    console.error("Error fetching saved templates:", err);
    return [];
  }
}

// Get bought templates
export async function getBoughtTemplates(): Promise<Template[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/templates1/boughted`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch bought templates");

    const data = await res.json();
    const raw = Array.isArray(data?.data) ? data.data : [];
    return raw.map(normalizeTemplate);
  } catch (err) {
    console.error("Error fetching bought templates:", err);
    return [];
  }
}

// ✅ Export constants (in case you need them in components)
export { API_URL, IMAGE_URL, FRONTEND_URL };

//template-gallery
