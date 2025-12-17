'use client'
import { SocialLink } from "@/types/template";
import { User, UserData } from "@/types/user";
import { useMemo } from "react";

export function useNormalizedUser(userData?: UserData): User | undefined {
  // useMemo ensures the normalization only recalculates when userData changes
  return useMemo(() => {
    if (!userData) return undefined;

    const socialLinks: SocialLink[] = userData.social_links
      ? Object.entries(userData.social_links).map(([platform, url], index) => ({
          id: `${platform}-${index}`,
          platform,
          username: "",
          url,
          isVisible: true,
        }))
      : [];

    return {
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      is_admin: userData.is_admin,
      avatar_url: userData.avatar_url ?? "",
      display_name: userData.display_name,
      profile_image: userData.avatar_url,
      profile_image_url: userData.avatar_url,
      social_links: socialLinks,
      profile: {
        socialLinks,
      },
    };
  }, [userData]);
}
