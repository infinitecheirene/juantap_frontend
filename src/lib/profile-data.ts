// This would typically fetch from your database
// For now, we'll use mock data

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon: string;
}

export interface ProfileData {
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  socialLinks: SocialLink[];
  template: {
    id: string;
    name: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
  };
  // Added for runtime & filtering
  isActive?: boolean;
  viewCount?: number;
  createdAt?: string;
}

// Mock data - replace with actual database calls
const mockProfiles: Record<string, ProfileData> = {
  johndoe: {
    username: "johndoe",
    displayName: "John Doe",
    bio: "Digital Creator & Tech Enthusiast. Sharing my journey in web development and design. Always learning, always creating. 🚀",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=300&width=800",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    email: "hello@johndoe.dev",
    phone: "+1 (555) 123-4567",
    socialLinks: [
      {
        platform: "Instagram",
        url: "https://instagram.com/johndoe",
        username: "@johndoe",
        icon: "instagram",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/johndoe",
        username: "John Doe",
        icon: "linkedin",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/johndoe",
        username: "@johndoe",
        icon: "twitter",
      },
      {
        platform: "GitHub",
        url: "https://github.com/johndoe",
        username: "johndoe",
        icon: "github",
      },
      {
        platform: "YouTube",
        url: "https://youtube.com/@johndoe",
        username: "John Doe",
        icon: "youtube",
      },
      {
        platform: "TikTok",
        url: "https://tiktok.com/@johndoe",
        username: "@johndoe",
        icon: "music",
      },
    ],
    template: {
      id: "modern-gradient",
      name: "Modern Gradient",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontFamily: "Inter",
    },
    isActive: true,
    createdAt: "2024-01-15",
    viewCount: 1247,
  },
  sarahmiller: {
    username: "sarahmiller",
    displayName: "Sarah Miller",
    bio: "UX Designer passionate about creating beautiful and functional digital experiences. Coffee lover ☕ | Dog mom 🐕",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=300&width=800",
    location: "New York, NY",
    website: "https://sarahmiller.design",
    socialLinks: [
      {
        platform: "Dribbble",
        url: "https://dribbble.com/sarahmiller",
        username: "sarahmiller",
        icon: "dribbble",
      },
      {
        platform: "Behance",
        url: "https://behance.net/sarahmiller",
        username: "Sarah Miller",
        icon: "behance",
      },
      {
        platform: "Instagram",
        url: "https://instagram.com/sarahdesigns",
        username: "@sarahdesigns",
        icon: "instagram",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/sarahmiller",
        username: "Sarah Miller",
        icon: "linkedin",
      },
    ],
    template: {
      id: "minimal-clean",
      name: "Minimal Clean",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      accentColor: "#ec4899",
      fontFamily: "Poppins",
    },
    isActive: true,
    createdAt: "2024-02-20",
    viewCount: 892,
  },
  shekinahvaldez: {
    username: "shekinahvaldez",
    displayName: "Shekinah Valdez",
    bio: "Creative UI/UX Designer focused on elegant simplicity and user-first experiences. Believer in clean design. ✨",
    avatar: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=300&width=800",
    location: "Manila, Philippines",
    website: "https://shekinahvaldez.com",
    email: "hello@shekinahvaldez.com",
    phone: "+63 912 345 6789",
    socialLinks: [
      {
        platform: "Instagram",
        url: "https://instagram.com/shek.design",
        username: "@shek.design",
        icon: "instagram",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/shekinahvaldez",
        username: "Shekinah Valdez",
        icon: "linkedin",
      },
      {
        platform: "Dribbble",
        url: "https://dribbble.com/shekinah",
        username: "shekinah",
        icon: "dribbble",
      },
      {
        platform: "Facebook",
        url: "https://facebook.com/shekinah.design",
        username: "Shekinah Valdez",
        icon: "facebook",
      },
    ],
    template: {
      id: "minimal-clean",
      name: "Minimal Clean",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      accentColor: "#8b5cf6",
      fontFamily: "Inter",
    },
    isActive: true,
    createdAt: "2024-06-10",
    viewCount: 351,
  },
};

export async function getPublicProfile(
  username: string
): Promise<ProfileData | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const profile = mockProfiles[username.toLowerCase()];

  if (!profile || !profile.isActive) {
    return null;
  }

  // Increment view count (in real app, this would be a separate API call)
  profile.viewCount = (profile.viewCount ?? 0) + 1;

  return profile;
}

export async function getAllPublicProfiles(): Promise<ProfileData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Object.values(mockProfiles).filter((profile) => profile.isActive);
}
