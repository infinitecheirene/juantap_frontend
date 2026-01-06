import type { JSX } from "react";

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  isVisible?: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_admin: boolean;
  avatar_url: string;
  display_name?: string;

  profile_image?: string;
  profile_image_url?: string;
  social_links?: string | SocialLink[];

  profile?: {
    bio?: string;
    phone?: string;
    avatar?: string;
    website?: string;
    location?: string;
    socialLinks?: SocialLink[];
  };
}

export interface Template {
  id: number;
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

  features?: string[];
  tags?: string[];

  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };

  fonts?: {
    heading?: string;
    body?: string;
  };

  layout?: string;
  social_style?: string;
  connection_style?: string;

  is_popular: boolean;
  is_new: boolean;
  is_active: boolean;

  isPopular?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;

  originalPrice?: number | null;
  previewUrl?: string;
  thumbnail?: string;

  socialStyle?: "default" | "circles" | "fullblock";
  connectStyle?: "grid" | "list" | "compact";

  downloads?: number;
  saves?: number;

  created_at?: string;
  updated_at?: string;

  status?: "saved" | "bought" | string;

  user?: User;

  previewComponent?: () => JSX.Element;
}

export type TemplateData = Template;

