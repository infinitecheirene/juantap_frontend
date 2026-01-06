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

export function NatureOrganic() {
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
            backgroundColor: data.profile?.background_value || "#f0fdf4",
            textColor: data.profile?.textColor || "#14532d",
            fontFamily:
              data.profile?.font_style || "'Source Sans Pro', sans-serif",
            primary: data.profile?.primary || "#22c55e",
            secondary: data.profile?.secondary || "#16a34a",
            accent: data.profile?.accent || "#84cc16",
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

  const copyUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="p-6 text-gray-500">No profile found.</p>;

  const primary = profile?.template?.primary || "#22c55e";
  const secondary = profile?.template?.secondary || "#16a34a";
  const accent = profile?.template?.accent || "#84cc16";
  const bg = profile?.template?.backgroundColor || "#f0fdf4";
  const text = profile?.template?.textColor || "#14532d";
  const font = profile?.template?.fontFamily || "'Source Sans Pro', sans-serif";

  return (
    <div
      className={`w-full p-4 flex justify-center items-center ${
        pathname.startsWith("/profile/") ? "min-h-screen" : ""
      }`}
      style={{
        background: bg,
        color: text,
        fontFamily: font,
      }}
    >
      {/* Card Container */}
      <div className="w-full max-w-xs bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transition hover:shadow-xl hover:-translate-y-1 duration-300">
        {/* Cover Image */}
        <div className="h-28 w-full" style={{ backgroundColor: primary }}>
          {profile?.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white/80 text-sm"
              style={{
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              }}
            ></div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-6 -mt-12 relative">
          <div
            className="w-24 h-24 rounded-full border-4 shadow-md overflow-hidden flex items-center justify-center"
            style={{ borderColor: bg, backgroundColor: accent }}
          >
            {profile?.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white/80" />
            )}
          </div>

          {/* Online Status */}
          <span
            className="absolute top-16 right-[35%] text-white text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: accent }}
          >
            Active
          </span>

          {/* Name & Bio */}
          <h1
            className="mt-4 text-lg font-semibold"
            style={{ color: secondary }}
          >
            {profile?.displayName || "Display Name"}
          </h1>
          {profile?.location && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin size={12} /> {profile.location}
            </p>
          )}
          {profile?.bio && (
            <p className="mt-2 text-xs text-gray-500 text-center leading-snug">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Section */}
        {(profile?.email || profile?.phone || profile?.website) && (
          <>
            <div className="border-t border-gray-200 mt-4"></div>
            <div className="px-6 py-3 space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Contact
              </h3>

              {profile?.email && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={14} style={{ color: secondary }} />
                    <span>{profile.email}</span>
                  </div>

                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => copyToClipboard(profile.email!)}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} style={{ color: secondary }} />
                    <span>{profile.phone}</span>
                  </div>

                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => copyToClipboard(profile.phone!)}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              )}

              {profile?.website && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Globe size={14} style={{ color: secondary }} />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: primary }}
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Social Links */}
        {(profile?.socialLinks?.length ?? 0) > 0 && (
          <>
            <div className="border-t border-gray-200"></div>
            <div className="px-6 py-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Connect
              </h3>
              <div className="flex flex-wrap gap-2">
                {(profile?.socialLinks ?? [])
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
                        className="flex items-center gap-2 px-3 py-1 text-xs rounded-full hover:opacity-80 transition text-white"
                        style={{ backgroundColor: secondary }}
                      >
                        {icon}
                        {link.username}
                      </a>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="flex justify-around p-3">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex flex-col items-center text-xs hover:opacity-70 transition"
              style={{ color: secondary }}
            >
              <QrCode className="w-4 h-4 mb-1" />
              <span>QR Code</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center text-xs hover:opacity-70 transition"
              style={{ color: secondary }}
            >
              <Share2 className="w-4 h-4 mb-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2"
              style={{ color: secondary }}
            >
              <QrCode className="w-5 h-5" /> QR Code for {profile.displayName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={profileUrl}
              size={256}
              level="H"
              fgColor={secondary}
              bgColor="#ffffff"
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyUrl}
                  style={{ color: primary }}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                style={{ borderColor: secondary, color: secondary }}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              
              <Button
                onClick={() => setIsQRModalOpen(false)}
                style={{ backgroundColor: primary, color: "white" }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
