"use client";

import React, { useState } from "react";
import {
  Mail,
  Globe,
  Copy,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  QrCode,
  Share2,
  Download,
  Send,
  MessageCircle,
  MapPin,
  Phone,
} from "lucide-react";
import { User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import type { Template, User } from "@/types/template";
import { toast } from "sonner";

interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
}

interface PreviewRendererProps {
  template: Template;
  user?: User | null;
  slug?: string;
}

export const PreviewRenderer: React.FC<PreviewRendererProps> = ({
  template,
  user,
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${
    user?.username || ""
  }`;

  const downloadQR = () => {
    const svg = document.querySelector<SVGSVGElement>("#qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `${user?.username || "profile"}-qr.jpg`;
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
    telegram: <Send size={16} />,
    viber: <MessageCircle size={16} />,
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = (text?: string) => {
    navigator.clipboard.writeText(text ?? "");
    toast.success("Copied!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: template?.name ?? "My Profile",
          text: template?.description ?? "",
          url: profileUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported.");
    }
  };

  const avatarUrl = user?.avatar_url || null;

  return (
    <div
      className="w-full flex justify-center p-5"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: template?.colors?.background,
          fontFamily: template?.fonts?.body,
        }}
      >
        {/* Banner */}
        <div
          className="w-full h-32"
          style={{
            background: `linear-gradient(135deg, ${template?.colors?.accent}, ${template?.colors?.primary})`,
          }}
        />

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-6 px-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white/20 -mt-12">
            {template.user?.avatar_url ? (
              <img
                src={template.user.avatar_url}
                alt={template.user.name || "Author"}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none"; // hide broken image
                }}
              />
            ) : (
              <UserIcon size={24} className="text-gray-400" />
            )}
          </div>

          <h1
            className="mt-4 text-xl font-bold"
            style={{
              fontFamily: template?.fonts?.heading,
              color: template?.colors?.text,
            }}
          >
            {user?.display_name || user?.name || user?.username || "Anonymous"}
          </h1>

          {user?.profile?.bio && (
            <p
              className="text-sm text-center mt-1"
              style={{
                color: template?.colors?.secondary,
                fontFamily: template?.fonts?.body,
              }}
            >
              {user.profile.bio}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="p-6 space-y-4">
          <h2
            className="text-sm font-semibold uppercase"
            style={{
              color: template?.colors?.secondary,
              fontFamily: template?.fonts?.heading,
            }}
          >
            Contact
          </h2>

          {/* Email */}
          {user?.email && (
            <div
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${template?.colors?.primary}10`,
                fontFamily: template?.fonts?.body,
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: template?.colors?.text }}
              >
                <Mail size={16} style={{ color: template?.colors?.accent }} />{" "}
                {user.email}
              </div>

              <button
                className="hover:opacity-70"
                style={{ color: template?.colors?.secondary }}
                onClick={() => handleCopy(user.email)}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {/* Phone */}
          {user?.profile?.phone && (
            <div
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${template?.colors?.primary}10`,
                fontFamily: template?.fonts?.body,
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: template?.colors?.text }}
              >
                <Phone size={16} style={{ color: template?.colors?.accent }} />{" "}
                {user.profile.phone}
              </div>

              <button
                className="hover:opacity-70"
                style={{ color: template?.colors?.secondary }}
                onClick={() => handleCopy(user?.profile?.phone)}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {/* Website */}
          {user?.profile?.website && (
            <div
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${template?.colors?.primary}10`,
                fontFamily: template?.fonts?.body,
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: template?.colors?.text }}
              >
                <Globe size={16} style={{ color: template?.colors?.accent }} />

                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  {user.profile.website}
                </a>
              </div>
              <button
                className="hover:opacity-70"
                style={{ color: template?.colors?.secondary }}
                onClick={() => handleCopy(user?.profile?.website)}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {/* Location */}
          {user?.profile?.location && (
            <div
              className="flex justify-between items-center rounded-lg p-3 text-sm"
              style={{
                backgroundColor: `${template?.colors?.primary}10`,
                fontFamily: template?.fonts?.body,
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: template?.colors?.text }}
              >
                <MapPin size={16} style={{ color: template?.colors?.accent }} />{" "}
                {user.profile.location}
              </div>

              <button
                className="hover:opacity-70"
                style={{ color: template?.colors?.secondary }}
                onClick={() => handleCopy(user?.profile?.location)}
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {user?.profile?.socialLinks &&
          user?.profile?.socialLinks?.length > 0 && (
            <div className="px-6 pb-6">
              <h2
                className="text-sm font-semibold uppercase mb-3"
                style={{
                  color: template?.colors?.secondary,
                  fontFamily: template?.fonts?.heading,
                }}
              >
                Connect with me
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {user?.profile?.socialLinks
                  ?.filter((link) => link.isVisible === true)

                  .map((link: SocialLink) => {
                    const platformKey = link.platform?.toLowerCase();
                    const icon = socialIconMap[platformKey] || (
                      <Globe size={14} />
                    );
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition"
                        style={{
                          backgroundColor: `${template?.colors?.accent}15`,
                          color: template?.colors?.text,
                          fontFamily: template?.fonts?.body,
                        }}
                      >
                        <span style={{ color: template?.colors?.accent }}>
                          {icon}
                        </span>
                        <span>{link.username}</span>
                      </a>
                    );
                  })}
              </div>
            </div>
          )}

        {/* Bottom Actions */}
        <div
          className="flex justify-around border-t p-4"
          style={{
            backgroundColor: `${template?.colors?.primary}08`,
            borderColor: `${template?.colors?.primary}20`,
            fontFamily: template?.fonts?.body,
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: template?.colors?.text }}
          >
            <QrCode
              className="w-5 h-5 mb-1"
              style={{ color: template?.colors?.accent }}
            />{" "}
            QR Code
          </button>

          <button
            onClick={() =>
              navigator.share?.({
                title: template?.name ?? "My Profile",
                text: template?.description ?? "",
                url: profileUrl,
              })
            }
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: template?.colors?.text }}
          >
            <Share2
              className="w-5 h-5 mb-1"
              style={{ color: template?.colors?.accent }}
            />{" "}
            Share
          </button>
        </div>
      </div>

      {/* QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" /> QR Code for{" "}
              {user?.name || "Anonymous"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG id="qr-code-svg" value={profileUrl} size={256} />
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              {profileUrl}
            </a>

            <div className="w-full p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Profile URL:</p>

              <div className="flex items-center justify-between">
                <code className="text-sm text-gray-800 truncate flex-1 mr-2">
                  {profileUrl}
                </code>

                <Button variant="ghost" size="sm" onClick={copyUrl}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>

              <Button onClick={() => setIsQRModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
