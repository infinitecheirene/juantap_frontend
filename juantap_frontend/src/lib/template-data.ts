// src/lib/template-data.ts
import axios from "axios";

import { User } from "@/types/template";

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  price: number | null;
  original_price?: number | null;
  discount?: number | null;
  preview_url: string;
  thumbnail_url: string;
  features?: any;
  colors?: any;
  fonts?: any;
  layout?: string;
  social_style?: string;
  connection_style?: string;
  tags?: any;
  is_popular: boolean;
  is_new: boolean;
  created_at?: string;
  updated_at?: string;
  downloads?: number;
  status?: "saved" | "bought" | string;

  user?: User;

  unlocks?: number; // downloads
  saves?: number; // views


  isActive: boolean;
  isNew?: boolean;
  isPopular: boolean;
  createdAt?: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL!;
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

// ✅ Fetch templates (authenticated if token exists)
export async function fetchTemplates(): Promise<Template[]> {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await axios.get(`${API_URL}/templates`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    // Adjust this depending on backend response
    return response.data.templates ?? response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

// ✅ Fetch all templates (no auth)
export async function getAllTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_URL}/templates`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

// ✅ Fetch template by slug
export async function getTemplateBySlug(slug: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Template not found");
  return res.json();
}

// ✅ Fetch template by ID
export async function getTemplateById(id: string): Promise<Template> {
  const res = await fetch(`${API_URL}/templates/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Template not found");
  return res.json();
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

    // ✅ Normalize avatar URL
    let avatarUrl = "/default-avatar.png";
    if (data.profile_image) {
      const cleanPath = data.profile_image.replace(/^storage\//, "");
      avatarUrl = `${IMAGE_URL.replace(/\/$/, "")}/storage/${cleanPath}`;
    }

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      is_admin: data.is_admin,
      avatar_url: avatarUrl,
      display_name: data.display_name ?? data.name,
      profile: {
        bio: data.profile?.bio ?? "",
        phone: data.profile?.phone ?? "",
        website: data.profile?.website ?? "",
        location: data.profile?.location ?? "",
        socialLinks: data.profile?.socialLinks ?? [],
      },
    };
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

    const templates: Template[] = await templatesRes.json();
    const stats: any[] = await statsRes.json();

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
    return Array.isArray(data) ? data : [];
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
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err) {
    console.error("Error fetching bought templates:", err);
    return [];
  }
}

// ✅ Export constants (in case you need them in components)
export { API_URL, IMAGE_URL, FRONTEND_URL };

//template-gallery
