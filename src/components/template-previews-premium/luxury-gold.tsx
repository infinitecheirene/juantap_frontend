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

export function LuxuryGold() {
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
            backgroundColor: data.profile?.backgroundColor || "#000000",
            textColor: data.profile?.textColor || "#ffffff",
            fontFamily: data.profile?.font_style || "Lato, sans-serif",
            primary: data.profile?.primary || "#d4af37",
            secondary: data.profile?.secondary || "#ffd700",
            accent: data.profile?.accent || "#b8860b",
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

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-300">Error: {error}</p>;
  if (!profile) return <p className="p-6 text-white">No profile found.</p>;

  const backgroundColor = profile.template?.backgroundColor || "#000000";
  const textColor = profile.template?.textColor || "#ffffff";
  const fontFamily = profile.template?.fontFamily || "Lato, sans-serif";
  const primary = profile.template?.primary || "#d4af37";
  const secondary = profile.template?.secondary || "#ffd700";

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
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border-4"
        style={{
          borderColor: primary,
          backgroundImage: `linear-gradient(145deg, ${primary}20, ${secondary}10)`,
          boxShadow: `0 0 30px ${primary}40`,
        }}
      >
        {/* Cover */}
        <div className="h-28 w-full" style={{ background: primary }}>
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="flex items-center justify-center h-full text-white/70 text-sm"
              style={{
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              }}
            />
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-6 -mt-12 relative">
          <div
            className="w-24 h-24 rounded-full border-4 shadow-lg overflow-hidden bg-white/20 flex items-center justify-center"
            style={{
              borderColor: secondary,
              boxShadow: `0 0 20px ${primary}60`,
            }}
          >
            {profile.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white/70" />
            )}
          </div>

          {/* Name & Bio */}
          <h1
            className="mt-4 text-lg font-bold"
            style={{
              fontFamily: "Playfair Display, serif",
              color: secondary,
              textShadow: `0 0 10px ${primary}50`,
            }}
          >
            {profile.displayName || "Display Name"}
          </h1>

          {profile.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-white/70" />
              <p className="text-xs text-white/70">{profile.location}</p>
            </div>
          )}

          {profile.bio && (
            <p className="mt-2 text-xs text-white/60 text-center leading-snug">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="px-6 py-3 space-y-2 mt-4">
          {profile.website && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm"
              style={{
                background: `linear-gradient(45deg, ${primary}20, ${secondary}10)`,
                border: `1px solid ${primary}40`,
              }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Globe size={16} style={{ color: secondary }} />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition truncate"
                  style={{ color: secondary }}
                >
                  {profile.website}
                </a>
              </div>

              <button
                onClick={() => copyToClipboard(profile.website!)}
                className="text-white/60 hover:text-white/80 transition"
                style={{ color: primary }}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {profile.email && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm"
              style={{
                background: `linear-gradient(45deg, ${primary}20, ${secondary}10)`,
                border: `1px solid ${primary}40`,
              }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Mail size={16} style={{ color: secondary }} />
                <span className="truncate">{profile.email}</span>
              </div>

              <button
                onClick={() => copyToClipboard(profile.email!)}
                className="text-white/60 hover:text-white/80 transition"
                style={{ color: primary }}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {profile.phone && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm"
              style={{
                background: `linear-gradient(45deg, ${primary}20, ${secondary}10)`,
                border: `1px solid ${primary}40`,
              }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Phone size={16} style={{ color: secondary }} />
                <span>{profile.phone}</span>
              </div>

              <button
                onClick={() => copyToClipboard(profile.phone!)}
                className="text-white/60 hover:text-white/80 transition"
                style={{ color: primary }}
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="px-6 pb-4">
            <div className="border-t border-white/20 pt-4">
              <h3
                className="text-xs font-medium mb-3 uppercase tracking-wide"
                style={{ color: secondary }}
              >
                Connect
              </h3>

              <div className="flex flex-wrap gap-2 justify-center">
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
                        className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full transition hover:opacity-80"
                        style={{
                          background: `linear-gradient(45deg, ${primary}30, ${secondary}20)`,
                          border: `1px solid ${primary}50`,
                          color: "white",
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
          className="flex justify-around border-t p-4"
          style={{
            borderColor: `${primary}40`,
            background: `linear-gradient(45deg, ${primary}10, ${secondary}05)`,
          }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-xs text-white/80 hover:text-white transition"
          >
            <QrCode className="w-4 h-4 mb-1" style={{ color: secondary }} />
            QR Code
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-xs text-white/80 hover:text-white transition"
          >
            <Share2 className="w-4 h-4 mb-1" style={{ color: secondary }} />
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
