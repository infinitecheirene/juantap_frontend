"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  MapPin,
  Copy,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Facebook,
  Globe,
  QrCode,
  Share2,
  Download,
  Camera,
  Edit3,
  AtSign,
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
  profileStyle?: "left" | "centered" | "right";
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    coverBackground: string;
    icon: string;
    background: string;
    title: string;
    description: string;
  };
  fonts?: {
    title: string;
    description: string;
  };
  fontSizes?: {
    title: number;
    description: number;
  };
}

export function MinimalClean({
  socialStyle = "default",
  connectStyle = "grid",
  profileStyle = "centered",
  colors = {
    primary: "#1f2937",
    secondary: "#6b7280",
    accent: "#3b82f6",
    coverBackground: "#f3f4f6",
    icon: "#3b82f6",
    background: "#ffffff",
    title: "#111827",
    description: "#6b7280",
  },
  fonts = {
    title: "Inter",
    description: "Inter",
  },
  fontSizes = {
    title: 16,
    description: 12,
  },
}: MinimalCleanProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1BRclz0vIHgGo4jUqoED4QUElLnLwR.png"
  );
  const [coverImage, setCoverImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const staticProfile = {
    displayName: "John Doe",
    location: "Manila, PH",
    handle: "john_doe",
    bio: "Bio goes here. This is an example bio for the minimal clean template.",
    email: "john.doe@gmail.com",
    socialLinks: [
      {
        id: "instagram",
        platform: "instagram",
        username: "john_doe",
        url: "https://instagram.com/2eub2e",
      },
      {
        id: "facebook",
        platform: "facebook",
        username: "john_doe",
        url: "https://facebook.com/2eub2e",
      },
    ],
  };

  const profileUrl = "https://example.com/john_doe";

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/upload-image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setCoverImage(base64Image);

        // Save to backend
        try {
          const token = localStorage.getItem("token");
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/update-cover`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              coverImage: base64Image,
            }),
          });
        } catch (error) {
          console.error("Failed to save cover image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
        if (data.coverImage) {
          setCoverImage(data.coverImage);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  const getSocialLinkClass = () => {
    switch (socialStyle) {
      case "circles":
        return "flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition";
      case "fullblock":
        return "flex items-center gap-3 rounded-lg p-4 text-sm hover:opacity-80 transition w-full";
      default:
        return "flex items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition";
    }
  };

  const getConnectGridClass = () => {
    switch (connectStyle) {
      case "list":
        return "flex flex-col gap-2";
      case "compact":
        return "flex flex-wrap gap-2";
      default:
        return "grid grid-cols-2 gap-3";
    }
  };

  const getProfileStyleClass = () => {
    switch (profileStyle) {
      case "left":
        return "items-start";
      case "centered":
        return "items-center";
      case "right":
        return "items-end";
      default:
        return "items-center";
    }
  };

  const getTextAlignClass = () => {
    switch (profileStyle) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const getInfoJustifyClass = () => {
    switch (profileStyle) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  const getCameraPositionClass = () => {
    switch (profileStyle) {
      case "left":
        return "left-0";
      case "centered":
        // center horizontally and offset correctly
        return "left-1/2 -translate-x-1/2";
      case "right":
        return "right-0";
      default:
        return "right-0";
    }
  };

  // Available fonts used across the template preview
  const fontOptions = [
    "Inter",
    "Poppins",
    "Roboto",
    "Playfair Display",
    "Merriweather",
    "Open Sans",
    "Lato",
    "Source Sans Pro",
    "Nunito",
  ];

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#f9fafb" }}
    >
      <div
        className="w-full max-w-lg shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: colors.background,
          fontFamily: `${fonts.description}, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`,
        }}
      >
        {/* Cover Photo Section */}
        <div className="relative w-full h-32 group">
          {coverImage ? (
            <img
              src={coverImage}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: (colors.coverBackground && colors.accent)
                  ? `linear-gradient(135deg, ${colors.coverBackground}, ${colors.accent})`
                  : (colors.primary && colors.secondary)
                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    : (colors.accent && colors.primary)
                      ? `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`
                      : '#f3f4f6',
              }}
            ></div>
          )}

          {/* Edit Cover Button */}
          <button
            onClick={handleCoverClick}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <Edit3 size={14} />
            Edit Cover
          </button>

          {/* Hidden Cover Input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* Avatar & Bio */}
        <div className={`relative flex flex-col ${getProfileStyleClass()} mt-2 px-6`}>
          <div className="relative -mt-14">
            <div
              className="w-28 h-28 rounded-full border-4 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center"
              style={{ borderColor: colors.background }}
            >
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Camera Icon Button */}
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-gray-200 opacity-90 transition-opacity"
            >
              <Camera size={18} className="text-gray-400" />
            </button>

            {/* Hidden Profile Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h1
            className={`mt-4 text-2xl font-bold ${getTextAlignClass()}`}
            style={{
              fontFamily: `${fonts.title}, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`,
              color: colors.title,
              fontSize: `${fontSizes.title}px`,
            }}
          >
            {staticProfile.displayName}
          </h1>
          <div
            className={`flex flex-wrap items-center gap-3 text-sm my-2 ${getInfoJustifyClass()}`}
            style={{
              color: colors.secondary,
              fontFamily: fonts.description,
            }}
          >
            <div className="flex items-center gap-1">
              <MapPin size={15} style={{ color: colors.icon }} />
              <span className="opacity-70 font-bold" style={{ color: colors.description }}>{staticProfile.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <AtSign size={15} style={{ color: colors.icon }} />
              <span className="opacity-70 font-bold" style={{ color: colors.description }}>{staticProfile.handle} </span>
            </div>
          </div>
          <p
            className={`text-sm mt-1 ${getTextAlignClass()}`}
            style={{
              color: colors.description,
              fontFamily: fonts.description,
            }}
          >
            {staticProfile.bio}
          </p>
        </div>

        <div className="border-t mx-5 mt-5" style={{ borderColor: `${colors.primary}20` }}></div>

        {/* Contact */}
        <div className="p-6 space-y-2">
          <h2
            className="text-md font-bold uppercase"
            style={{
              color: colors.title,
              fontFamily: fonts.title,
            }}
          >
            Contact
          </h2>
          <div
            className="flex justify-between items-center rounded-lg p-3 text-sm"
            style={{
              backgroundColor: `${colors.primary}10`,
              fontFamily: fonts.description,
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ color: colors.description }}
            >
              <Mail size={16} style={{ color: colors.icon }} />{" "}
              {staticProfile.email}
            </div>
            <button
              className="hover:opacity-70"
              style={{ color: colors.icon }}
              onClick={() => navigator.clipboard.writeText(staticProfile.email)}
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="px-6 pb-6">
          <h2
            className="text-md font-bold uppercase mb-3"
            style={{
              color: colors.title,
              fontFamily: fonts.title,
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
                    color: colors.description,
                    fontFamily: fonts.description,
                  }}
                >
                  {(socialStyle as string) === "circles" ? (
                    <span style={{ color: colors.icon }}>{icon}</span>
                  ) : (
                    <>
                      <span style={{ color: colors.icon }}>{icon}</span>
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
            fontFamily: fonts.description,
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors.title }}
          >
            <QrCode className="w-5 h-5 mb-1" style={{ color: colors.icon }} />{" "}
            QR Code
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-sm hover:opacity-70"
            style={{ color: colors.title }}
          >
            <Share2 className="w-5 h-5 mb-1" style={{ color: colors.icon }} />{" "}
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