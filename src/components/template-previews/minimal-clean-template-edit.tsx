"use client";

import type React from "react";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Globe,
  Copy,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Facebook,
  QrCode,
  Share2,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface MinimalCleanProps {
  socialStyle?: "default" | "circles" | "fullblock";
  connectStyle?: "grid" | "list" | "compact";
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
}

export function MinimalClean({
  socialStyle = "default",
  connectStyle = "grid",
  colors = {
    primary: "#1f2937",
    secondary: "#6b7280",
    accent: "#3b82f6",
    background: "#ffffff",
    text: "#111827",
  },
  fonts = {
    heading: "Inter",
    body: "Inter",
  },
}: MinimalCleanProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const staticProfile = {
    displayName: "example_displayname",
    location: "Manila PH",
    handle: "@username",
    bio: "this is bio example text",
    email: "admin.example@gmail.com",
    socialLinks: [
      {
        id: "instagram",
        platform: "instagram",
        username: "instagram_account",
        url: "https://instagram.com/2eub2e",
      },
      {
        id: "facebook",
        platform: "facebook",
        username: "facebook_account",
        url: "https://facebook.com/2eub2e",
      },
      {
        id: "linkedin",
        platform: "linkedin",
        username: "linkedin_account",
        url: "https://linkedin.com/2eub2e",
      },
      {
        id: "indeed",
        platform: "indeed",
        username: "indeed_account",
        url: "https://indeed.com/2eub2e",
      },
    ],
  };

  const profileUrl = "https://example.com/example_displayname";

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's something interesting for you.",
          url: window.location.href,
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

  const getSocialLinkClass = () => {
    switch (socialStyle) {
      case "circles":
        return "flex w-10 h-10 items-center justify-center rounded-full hover:opacity-80 transition";
      case "fullblock":
        return "flex w-full h-full items-center gap-3 rounded-lg p-4 text-sm hover:opacity-80 transition w-full";
      default:
        return "flex w-full h-full items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition";
    }
  };

  const getConnectGridClass = () => {
    switch (connectStyle) {
      case "list":
        return "flex flex-col gap-2";
      case "compact":
        return "flex flex-wrap gap-2";
      default:
        return "grid grid-cols-1 gap-3";
    }
  };

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.background,
          fontFamily: fonts.body,
        }}
      >
        <div
          className="w-full h-32"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
          }}
        ></div>

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-2 px-6">
          <div
            className="w-28 h-28 rounded-full border-4 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center -mt-14"
            style={{ borderColor: colors.background }}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1BRclz0vIHgGo4jUqoED4QUElLnLwR.png"
              alt="displaylua"
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className="mt-4 text-xl font-bold"
            style={{
              fontFamily: fonts.heading,
              color: colors.text,
            }}
          >
            {staticProfile.displayName}
          </h1>
          <div
            className="flex flex-wrap items-center gap-3 text-xs mt-2 justify-center"
            style={{
              color: colors.secondary,
              fontFamily: fonts.body, // Added explicit body font to location/handle text
            }}
          >
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {staticProfile.location}
            </span>
            <span style={{ color: colors.accent }}>{staticProfile.handle}</span>
          </div>
          <p
            className="text-sm text-center mt-1"
            style={{
              color: colors.secondary,
              fontFamily: fonts.body, // Added explicit body font to bio text
            }}
          >
            {staticProfile.bio}
          </p>
        </div>

        {/* Contact */}
        <div className="p-6 space-y-4">
          <h2
            className="text-sm font-semibold uppercase"
            style={{
              color: colors.secondary,
              fontFamily: fonts.heading,
            }}
          >
            Contact
          </h2>
          <div
            className="flex justify-between items-center rounded-lg p-3 text-sm"
            style={{
              backgroundColor: `${colors.primary}10`,
              fontFamily: fonts.body, // Added explicit body font to contact section
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: colors.text }}
            >
              <Mail size={16} style={{ color: colors.accent }} />{" "}
              {staticProfile.email}
            </div>
            <button
              className="hover:opacity-70"
              style={{ color: colors.secondary }}
              onClick={() => navigator.clipboard.writeText(staticProfile.email)}
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="px-6 pb-6">
          <h2
            className="text-sm font-semibold uppercase mb-3"
            style={{
              color: colors.secondary,
              fontFamily: fonts.heading,
            }}
          >
            Connect with me
          </h2>
          <div className={getConnectGridClass()}>
            {staticProfile.socialLinks.map((link) => {
              const platformKey = link.platform.toLowerCase();
              const icon = socialIconMap[platformKey] || <Globe size={14} />;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={getSocialLinkClass()}
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    color: colors.text,
                    fontFamily: fonts.body, // Added explicit body font to social links
                  }}
                >
                  {(socialStyle as string) === "circles" ? (
                    <span style={{ color: colors.accent }}>{icon}</span>
                  ) : (
                    <>
                      <span style={{ color: colors.accent }}>{icon}</span>
                      {(socialStyle as string) !== "circles" && (
                        <span>{link.username}</span>
                      )}
                    </>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          className="flex justify-around border-t p-4"
          style={{
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`,
            fontFamily: fonts.body, // Added explicit body font to bottom actions
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors.text }}
          >
            <QrCode className="w-5 h-5 mb-1" style={{ color: colors.accent }} />{" "}
            QR Code
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors.text }}
          >
            <Share2 className="w-5 h-5 mb-1" style={{ color: colors.accent }} />{" "}
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
              QR Code for {staticProfile.displayName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG value={profileUrl} size={256} />

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
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <Button onClick={() => setIsQRModalOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
