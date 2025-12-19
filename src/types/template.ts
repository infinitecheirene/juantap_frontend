

export interface SocialLink {
  id: string
  platform: string
  username: string
  url: string
  isVisible?: boolean
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  is_admin: boolean
  avatar_url: string
  display_name?: string

  // ✅ add these two optional fields
  profile_image?: string
  profile_image_url?: string

   social_links?: SocialLink[] 
   
  profile?: {
    bio?: string
    phone?: string
    website?: string
    location?: string
    socialLinks?: SocialLink[]
  }
}

export interface Template {
  id: string
  slug: string
  name: string
  description: string
  category: string
  is_premium: boolean
  price: number | null
  original_price?: number | null
  discount?: number | null
  preview_url: string
  thumbnail_url: string
  features?: any
  colors?: any
  fonts?: any
  layout?: string
  tags?: any
  is_popular: boolean
  is_new: boolean
  created_at?: string
  updated_at?: string
  downloads?: number
  status?: "saved" | "bought" | string

  user?: User

  unlocks?: number // downloads
  saves?: number // views
  previewComponent: React.ComponentType<any> 
  socialStyle?: "default" | "circles" | "fullblock" | string
  connectStyle: "grid" | "list" | "compact" | string
}

export interface TemplateData {
  id: string
  slug: string
  name: string
  description: string
  preview_url: string
  thumbnail_url: string
  is_premium: boolean
  created_at: string
  updated_at: string
  category: "free" | "premium" | string
  price: number
  original_price?: number
  discount?: number
  features: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: "minimal" | "modern" | "creative" | "professional" | "artistic" | string
  tags: string[]
  is_popular: boolean
  is_hidden?: boolean
  is_new: boolean
  downloads: number
  socialStyle: "default" | "circles" | "fullblock" | string
  connectStyle: "grid" | "list" | string
}
