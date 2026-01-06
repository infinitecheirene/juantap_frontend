"use client";

import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Globe,
  User,
} from "lucide-react";
import type { JSX } from "react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username?: string;
  isVisible: boolean;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  profile_image?: string;
  profile?: {
    socialLinks?: SocialLink[];
  };
}

interface ProfilePreviewProps {
  user: UserData;
}

export function ProfilePreview({ user }: ProfilePreviewProps) {
  const socialIconMap: Record<string, JSX.Element> = {
    facebook: <Facebook size={14} />,
    instagram: <Instagram size={14} />,
    twitter: <Twitter size={14} />,
    linkedin: <Linkedin size={14} />,
    github: <Github size={14} />,
    youtube: <Youtube size={14} />,
    tiktok: <Music size={14} />,
  };

  const visibleLinks =
    user.profile?.socialLinks?.filter((link) => link.isVisible) || [];

  return (
    <div className="relative flex justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border shadow-xl p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center">
            <User size={32} className="text-gray-500" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Social Media Links */}
        {visibleLinks.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {visibleLinks.map((link) => {
                const key = link.platform?.toLowerCase() || "";
                const icon = socialIconMap[key] || <Globe size={14} />;

                return (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center gap-1 rounded-full px-3"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    {icon}
                    <span className="whitespace-nowrap">{link.platform}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t my-6" />

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <QRCodeCanvas
            value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user.username}`}
            size={140}
          />
          <p className="text-xs text-gray-500 text-center">
            Scan to view profile
          </p>
        </div>
      </div>
    </div>
  );
}
