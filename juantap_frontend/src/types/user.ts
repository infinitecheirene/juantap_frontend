import { SocialLink } from "./template"

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

export interface UserData {
  id: number
  username: string
  name: string
  email: string
  display_name?: string
  is_admin: boolean
  avatar_url: string
  title?: string
  address?: string
  social_links?: Record<string, string>
}
