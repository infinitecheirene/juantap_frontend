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
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border">
        {/* Profile Icon */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-gray-100">
            <User size={32} className="text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Social Media Links */}
        {visibleLinks.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {visibleLinks.map((link) => {
              const key = link.platform?.toLowerCase() || "";
              const icon = socialIconMap[key] || <Globe size={14} />;
              return (
                <Button
                  key={link.id}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent flex items-center gap-1"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  {icon}
                  {link.platform}
                </Button>
              );
            })}
          </div>
        )}

        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodeCanvas
            value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user.username}`}
            size={128}
          />
        </div>
      </div>
    </div>
  );
}
