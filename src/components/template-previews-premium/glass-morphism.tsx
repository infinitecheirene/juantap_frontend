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

export function GlassMorphism() {
  const { username } = useParams<{ username?: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const pathname = usePathname();

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
            backgroundColor:
              data.profile?.backgroundColor ||
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textColor: data.profile?.textColor || "#1f2937",
            fontFamily:
              data.profile?.font_style || "'SF Pro Display', sans-serif",
            primary: data.profile?.primary || "#6366f1",
            secondary: data.profile?.secondary || "#8b5cf6",
            accent: data.profile?.accent || "#ec4899",
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

  const primary = profile.template?.primary || "#6366f1";
  const secondary = profile.template?.secondary || "#8b5cf6";
  const accent = profile.template?.accent || "#ec4899";
  const backgroundColor =
    profile.template?.backgroundColor ||
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const textColor = profile.template?.textColor || "#1f2937";
  const fontFamily =
    profile.template?.fontFamily || "'SF Pro Display', sans-serif";

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
        className="w-full max-w-sm rounded-2xl overflow-hidden border transition transform duration-300 backdrop-blur-lg bg-white/10"
        style={{
          borderColor: "rgba(255, 255, 255, 0.3)",
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`,
        }}
      >
        {/* Cover Image */}
        <div className="h-28 w-full bg-white/20">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-white/70"></div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-6 -mt-12 relative z-10">
          <div
            className="w-24 h-24 rounded-full border-4 overflow-hidden backdrop-blur-md bg-white/30 flex items-center justify-center"
            style={{
              borderColor: secondary,
              boxShadow: `0 4px 30px rgba(0, 0, 0, 0.1), 0 0 15px ${accent}`,
            }}
          >
            {/* Avatar */}
            {profile.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={48}
                className="text-white/80"
                style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
              />
            )}
          </div>

          {/* Name & Bio */}
          <h1
            className="mt-4 text-lg font-bold"
            style={{
              color: primary,
              textShadow: `0 0 5px rgba(255,255,255,0.5)`,
            }}
          >
            {profile.displayName || "Display Name"}
          </h1>

          {/* Location */}
          {profile.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-white/80" />
              <p className="text-xs text-white/80">{profile.location}</p>
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="mt-2 text-xs text-white/80 text-center leading-snug">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="px-6 py-3 space-y-2 mt-4">
          {/* Website */}
          {profile.website && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm backdrop-blur-sm bg-white/10"
              style={{ border: `1px solid rgba(255,255,255,0.2)` }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Globe size={16} />
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

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(profile.website!)}
                className="text-white/60 hover:text-white/80 transition"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {/* Email */}
          {profile.email && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm backdrop-blur-sm bg-white/10"
              style={{ border: `1px solid rgba(255,255,255,0.2)` }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Mail size={16} />
                <span className="truncate">{profile.email}</span>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(profile.email!)}
                className="text-white/60 hover:text-white/80 transition"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {/* Phone */}
          {profile.phone && (
            <div
              className="flex items-center justify-between rounded-lg p-3 text-sm backdrop-blur-sm bg-white/10"
              style={{ border: `1px solid rgba(255,255,255,0.2)` }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <Phone size={16} />
                <span>{profile.phone}</span>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(profile.phone!)}
                className="text-white/60 hover:text-white/80 transition"
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="px-6 pb-4">
            <div
              className="border-t pt-4"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              <h3 className="text-xs font-medium text-white/90 mb-3 uppercase tracking-wide">
                Connect
              </h3>
              <div className="flex flex-wrap gap-2">
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
                        className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full backdrop-blur-sm bg-white/30 text-white transition hover:bg-white/40"
                        style={{
                          boxShadow: `0 0 10px ${accent}`,
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
          className="flex justify-around border-t backdrop-blur-sm bg-white/5 p-4"
          style={{ borderColor: "rgba(255,255,255,0.3)" }}
        >
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-xs text-white/80 hover:text-white transition"
          >
            <QrCode
              className="w-4 h-4 mb-1"
              style={{ filter: `drop-shadow(0 0 3px ${primary})` }}
            />
            QR Code
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center text-xs text-white/80 hover:text-white transition"
          >
            <Share2
              className="w-4 h-4 mb-1"
              style={{ filter: `drop-shadow(0 0 3px ${secondary})` }}
            />
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
            <QRCodeSVG
              value={profileUrl}
              size={256}
              level="H"
              imageSettings={{
                src: "/logo.png",
                height: 40,
                width: 40,
                excavate: true,
              }}
            />

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
