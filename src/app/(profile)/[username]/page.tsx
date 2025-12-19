"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { PreviewRenderer } from "@/components/templates/PreviewRenderer";
// ✅ Import your custom Loading component
import { Loading } from "@/components/loading";
import type { Template } from "@/types/template";

interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  is_visible?: boolean | number;
}

interface UserData {
  id: number;
  slug?: string;
  name: string;
  firstname?: string;
  lastname?: string;
  display_name?: string;
  username: string;
  email: string;
  is_admin: boolean;
  avatar_url: string;
  profile?: {
    bio?: string;
    phone?: string;
    website?: string;
    location?: string;
    template_id?: number;
    background_type?: string;
    background_value?: string;
    font_style?: string;
    font_size?: string;
    button_style?: string;
    accent_color?: string;
    nfc_redirect_url?: string;
    is_published?: boolean;
    socialLinks?: SocialLink[];
  };
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const templateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}/used-templates`
      );
      const usedTemplates = templateRes.ok ? await templateRes.json() : [];

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`
      );
      const user = userRes.ok ? await userRes.json() : null;

      let finalTemplate: Template | null = null;
      if (usedTemplates?.length) {
        const t = usedTemplates[0];

        // fetch full template details
        const fullTemplateRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/templates/${t.slug}`
        );
        const fullTemplate = fullTemplateRes.ok
          ? await fullTemplateRes.json()
          : null;

        finalTemplate = {
          ...fullTemplate,
          thumbnail_url: fullTemplate?.thumbnail_url
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${fullTemplate.thumbnail_url}`
            : "/placeholder.svg",
        };
      }

      setTemplateData(finalTemplate);
      if (user) {
        setUserData({
          ...user,
          avatar_url: user.avatar_url,
          title: user.profile?.bio ?? "",
          address: user.profile?.location ?? "",
          social_links:
            user.profile?.socialLinks?.reduce(
              (acc: Record<string, string>, link: SocialLink) => {
                acc[link.platform.toLowerCase()] = link.url;
                return acc;
              },
              {}
            ) ?? {},
        });
      }

      setLoading(false);
    }
    fetchData();
  }, [username]);

  if (loading) return <Loading />; // ✅ Use custom Loading component
  if (!templateData) return notFound();

  return (
    <main className="flex-1">
      {templateData && userData && (
        <PreviewRenderer
          template={templateData}
          user={userData}
          slug={templateData.slug}
        />
      )}
    </main>
  );
}
