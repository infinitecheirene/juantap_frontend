"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
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
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { usePathname } from "next/navigation";

interface SocialLink {
  id: string;
  username: string;
  platform: string;
  url: string;
  isVisible: boolean;
}

interface ProfileData {
  username?: string;
  displayName?: string;
  location?: string;
  bio?: string;
  coverImage?: string;
  avatar?: string;
  website?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
  template?: {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

export function MinimalistPro() {
  const { username } = useParams<{ username?: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const profileUrl = profile?.username
    ? `${frontendUrl}/${profile.username}`
    : profile?.displayName
    ? `${frontendUrl}/${profile.displayName}`
    : frontendUrl;

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={14} />,
    instagram: <Instagram size={14} />,
    twitter: <Twitter size={14} />,
    linkedin: <Linkedin size={14} />,
    github: <Github size={14} />,
    youtube: <Youtube size={14} />,
    tiktok: <Music size={14} />,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let endpoint = "";
        let headers: HeadersInit = { Accept: "application/json" };

        if (username) {
          endpoint = `${baseUrl}/profile/${username}`;
        } else {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No authentication token found");
          endpoint = `${baseUrl}/user-profile`;
          headers = { ...headers, Authorization: `Bearer ${token}` };
        }

        const res = await fetch(endpoint, { headers });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile({
          username: data.username,
          displayName: data.display_name,
          location: data.profile?.location,
          bio: data.profile?.bio,
          coverImage:
            data.profile?.background_type === "image"
              ? `${baseUrl}${data.profile?.background_value}`
              : undefined,
          avatar: data.profile_image || undefined,
          website: data.profile?.website,
          phone: data.profile?.phone,
          email: data.email,
          socialLinks: data.profile?.socialLinks || [],
          template: {
            backgroundColor: data.profile?.backgroundColor || "#ffffff",
            textColor: data.profile?.textColor || "#111827",
            fontFamily: data.profile?.font_style || "'Inter', sans-serif",
            primary: data.profile?.primary || "#000000",
            secondary: data.profile?.secondary || "#6b7280",
            accent: data.profile?.accent || "#3b82f6",
          },
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, baseUrl]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUrl = () => {
    if (!profileUrl) return;
    copyToClipboard(profileUrl);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="p-6 text-gray-600">No profile found.</p>;

  const primary = profile.template?.primary || "#000000";
  const secondary = profile.template?.secondary || "#6b7280";
  const accent = profile.template?.accent || "#3b82f6";
  const backgroundColor = profile.template?.backgroundColor || "#ffffff";
  const textColor = profile.template?.textColor || "#111827";
  const fontFamily = profile.template?.fontFamily || "'Inter', sans-serif";

  return (
    <div
      className={`w-full p-4 flex justify-center items-center ${
        pathname.startsWith("/profile/") ? "min-h-screen" : ""
      }`}
      style={{
        background: backgroundColor,
        color: textColor,
        fontFamily: fontFamily,
      }}
    >
      {/* Card Container */}
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
        style={{
          background: "#fff",
        }}
      >
        {/* Cover Image */}
        <div className="h-28 w-full bg-gray-100"></div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-6 -mt-12 relative">
          <div
            className="w-24 h-24 rounded-full border-2 overflow-hidden bg-gray-50 flex items-center justify-center"
            style={{
              borderColor: "#e5e7eb",
            }}
          >
            {profile.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>

          {/* Name & Bio */}
          <h1
            className="mt-4 text-xl font-semibold tracking-tight"
            style={{
              color: primary,
            }}
          >
            {profile.displayName || "Display Name"}
          </h1>

          {profile.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-gray-500" />
              <p className="text-sm text-gray-500">{profile.location}</p>
            </div>
          )}

          {profile.bio && (
            <p className="mt-2 text-sm text-gray-600 text-center leading-snug">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="px-6 py-3 space-y-2 mt-4">
          {profile.website && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm border">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition truncate"
                  style={{ color: accent }}
                >
                  {profile.website}
                </a>
              </div>

              <button
                onClick={() => copyToClipboard(profile.website!)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm border">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span className="truncate text-gray-700">{profile.email}</span>
              </div>

              <button
                onClick={() => copyToClipboard(profile.email!)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm border">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{profile.phone}</span>
              </div>

              <button
                onClick={() => copyToClipboard(profile.phone!)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="px-6 pb-4">
            <div className="border-t pt-4" style={{ borderColor: "#e5e7eb" }}>
              <h3 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">
                Connect
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {profile.socialLinks
                  .filter((link) => link.isVisible)
                  .map((link) => {
                    // normalize key: lowercase and trim
                    const platformKey = (link.platform || link.id || "")
                      .trim()
                      .toLowerCase();
                    const icon = socialIconMap[platformKey] || (
                      <Globe size={14} />
                    );
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                        style={{
                          color: primary,
                        }}
                      >
                        {icon}
                        {link.username}
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div
          className="flex justify-around border-t bg-gray-50/50 p-4"
          style={{ borderColor: "#e5e7eb" }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-gray-800 transition"
          >
            <QrCode className="w-5 h-5 mb-1" />
            QR Code
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-gray-800 transition"
          >
            <Share2 className="w-5 h-5 mb-1" />
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
              QR Code for {profile.displayName}
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
