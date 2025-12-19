export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  isVisible?: boolean | number;
}


export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_admin: boolean;
  avatar_url: string;
  display_name?: string;

  // ✅ add these two optional fields
  profile_image?: string;
  profile_image_url?: string;

  profile: {
    bio: string;
    phone: string;
    avatar: string;
    website: string;
    location: string;
    socialLinks?: SocialLink[];
  };
}

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
