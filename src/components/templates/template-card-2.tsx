"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
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
  Phone,
  UserIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Template, User } from "@/types/template";

interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  is_visible?: boolean | number;
}

interface TemplateCardProps {
  template: Template;
  user: User | null;
  slug: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  user,
  slug,
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${
    user?.username || ""
  }`;

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
  };

  const author = user
    ? {
        displayName: user.name,
        avatar: user.profile?.avatar || user.avatar_url || null,
        email: user.email ?? null,
        phone: user.profile?.phone ?? null,
        website: user.profile?.website ?? null,
        location: user.profile?.location ?? null,
        bio: user.profile?.bio ?? null,
        socialLinks: user.profile?.socialLinks ?? [],
      }
    : {
        displayName: "Anonymous",
        avatar: null,
        email: null,
        phone: null,
        website: null,
        location: null,
        bio: null,
        socialLinks: [],
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
      alert("Sharing is not supported on this browser.");
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full flex justify-center p-6"
      style={{ backgroundColor: "transparent" }}
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
            {author.avatar && !avatarError ? (
              <img
                src={author.avatar}
                alt={author.displayName}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-white/20">
                <UserIcon size={64} className="text-gray-400" />
              </div>
            )}
          </div>
          <h1
            className="mt-4 text-xl font-bold"
            style={{
              fontFamily: template?.fonts?.heading,
              color: template?.colors?.text,
            }}
          >
            {author.displayName}
          </h1>

          {author.bio && (
            <p
              className="text-sm text-center mt-1"
              style={{
                color: template?.colors?.secondary,
                fontFamily: template?.fonts?.body,
              }}
            >
              {author.bio}
            </p>
          )}
        </div>

        {/* Contact */}
        {(author.email ||
          author.phone ||
          author.website ||
          author.location) && (
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
            {author.email && (
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
                  {author.email}
                </div>
                <button
                  className="hover:opacity-70"
                  style={{ color: template?.colors?.secondary }}
                  onClick={() => navigator.clipboard.writeText(author.email!)}
                >
                  <Copy size={16} />
                </button>
              </div>
            )}

            {/* Phone */}
            {author.phone && (
              <div
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${template?.colors?.primary}10`,
                  color: template?.colors?.text,
                  fontFamily: template?.fonts?.body,
                }}
              >
                <Phone size={16} style={{ color: template?.colors?.accent }} />{" "}
                {author.phone}
              </div>
            )}

            {/* Website */}
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:opacity-80 transition"
                style={{
                  backgroundColor: `${template?.colors?.primary}10`,
                  color: template?.colors?.text,
                  fontFamily: template?.fonts?.body,
                }}
              >
                <Globe size={16} style={{ color: template?.colors?.accent }} />{" "}
                {author.website}
              </a>
            )}

            {/* Location */}
            {author.location && (
              <div
                className="flex items-center gap-2 rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: `${template?.colors?.primary}10`,
                  color: template?.colors?.text,
                  fontFamily: template?.fonts?.body,
                }}
              >
                <MapPin size={16} style={{ color: template?.colors?.accent }} />{" "}
                {author.location}
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {author.socialLinks?.length > 0 && (
          <div className="px-6 pb-6">
            <h2
              className={`text-sm font-semibold uppercase mb-3 w-auto ${
                template.social_style === "circles" &&
                template.connection_style === "list"
                  ? "flex flex-row"
                  : "grid grid-cols-1"
              } 
                 gap-3`}
              style={{
                color: template?.colors?.secondary,
                fontFamily: template?.fonts?.heading,
              }}
            >
              Connect with me
            </h2>{" "}
            <div
              className={`${
                template.connection_style === "list"
                  ? ""
                  : "grid grid-cols-2"
              }  gap-3`}
            >
              {author.socialLinks.map((link: SocialLink) => {
                const platformKey = link.platform?.toLowerCase();
                const icon = socialIconMap[platformKey] || <Globe size={14} />;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={` ${
                      template.social_style === "circles"
                        ? "w-full h-full rounded-lg"
                        : "w-8 h-8 rounded-full"
                    } justify-center items-center gap-2 p-2 text-sm hover:opacity-80 transition`}
                    style={{
                      backgroundColor: `${template?.colors?.accent}15`,
                      color: template?.colors?.text,
                      fontFamily: template?.fonts?.body,
                    }}
                  >
                    <span style={{ color: template?.colors?.accent }}>
                      {icon}
                    </span>

                    <span
                      className={`hidden  ${
                        template.connection_style === "circles"
                          ? "hidden"
                          : "inline-block"
                      }`}
                    >
                      {link.username}
                    </span>
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
            onClick={handleShare}
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
              <QrCode className="w-5 h-5" />
              QR Code for {author.displayName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="w-full flex justify-center">
              <QRCodeSVG
                value={profileUrl}
                size={200}
                className="w-full max-w-[220px] h-auto"
              />
            </div>
            <div className="w-full p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
              <p className="text-gray-600 mb-2">Profile URL:</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <code className="text-gray-800 truncate flex-1">
                  {profileUrl}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyUrl}
                  className="self-end sm:self-auto"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => setIsQRModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
