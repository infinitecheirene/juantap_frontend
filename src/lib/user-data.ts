export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  phone?: string;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    username: string;
    isVisible: boolean;
  }>;
  template: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock user data - replace with actual database calls
const mockUserProfile: UserProfile = {
  id: "user-123",
  username: "johndoe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  bio: "Digital Creator & Tech Enthusiast. Sharing my journey in web development and design. Always learning, always creating. 🚀",
  avatar: "/placeholder.svg?height=120&width=120",
  coverImage: "/placeholder.svg?height=300&width=800",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  phone: "+1 (555) 123-4567",
  socialLinks: [
    {
      id: "1",
      platform: "Instagram",
      url: "https://instagram.com/johndoe",
      username: "@johndoe",
      isVisible: true,
    },
    {
      id: "2",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
      username: "John Doe",
      isVisible: true,
    },
    {
      id: "3",
      platform: "Twitter",
      url: "https://twitter.com/johndoe",
      username: "@johndoe",
      isVisible: true,
    },
    {
      id: "4",
      platform: "GitHub",
      url: "https://github.com/johndoe",
      username: "johndoe",
      isVisible: false,
    },
  ],
  template: {
    id: "minimal-clean",
    name: "Minimal Clean",
  },
  isActive: true,
  createdAt: "2024-01-15",
  updatedAt: "2024-03-15",
};

export async function getUserProfile(userId: string): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockUserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would update the database
  const updatedProfile = {
    ...mockUserProfile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  console.log("Profile updated:", updatedProfile);

  return updatedProfile;
}
