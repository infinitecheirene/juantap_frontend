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
    gradientFrom?: string;
    gradientTo?: string;
  };
}

export function MinimalClean() {
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
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
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
            backgroundColor:
              data.profile?.background_type === "color"
                ? data.profile?.background_value
                : "#f9fafb",
            textColor: "#111827",
            fontFamily: data.profile?.font_style || "Inter, sans-serif",
            gradientFrom: data.profile?.gradientFrom,
            gradientTo: data.profile?.gradientTo,
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
          text: "Here’s something interesting for you.",
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

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="p-6 text-gray-500">No profile found.</p>;

  const { backgroundColor, textColor, fontFamily, gradientFrom, gradientTo } =
    profile.template || {};

  return (
    <div
      className="w-full flex justify-center p-5"
      style={{
        background: backgroundColor,
        color: textColor,
        fontFamily,
      }}
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col">
        {/* Cover */}
        <div
          className="w-full"
          style={{
            background: !profile.coverImage
              ? `linear-gradient(135deg, ${gradientFrom || "#667eea"}, ${
                  gradientTo || "#764ba2"
                })`
              : undefined,
          }}
        >
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full object-cover"
            />
          )}
        </div>

        {/* Avatar & Bio */}
        <div className="relative flex flex-col items-center mt-6 px-6">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {profile.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={32} className="text-gray-500" />
            )}
          </div>
          <h1 className="mt-4 text-xl font-bold">
            {profile.displayName || "Display Name"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2 justify-center">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-500"
              >
                <Globe size={12} /> {profile.website}
              </a>
            )}
          </div>
          {profile.bio && (
            <p className="text-sm text-gray-600 text-center mt-1">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">
            Contact
          </h2>
          
          {profile.email && (
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} /> {profile.email}
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => navigator.clipboard.writeText(profile.email ?? "")}
              >
                <Copy size={16} />
              </button>
            </div>
          )}

          {profile.phone && (
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} /> {profile.phone}
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => navigator.clipboard.writeText(profile.phone ?? "")}
              >
                <Copy size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {profile.socialLinks?.length ? (
          <div className="px-6 pb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Connect with me
            </h2>
            <div className="grid grid-cols-2 gap-3">
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
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 text-sm hover:bg-gray-100 transition"
                    >
                      {icon}
                      {link.username}
                    </a>
                  );
                })}
            </div>
          </div>
        ) : null}

        {/* Bottom Actions */}
        <div className="flex justify-around border-t bg-gray-50 p-4">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex flex-col items-center text-sm"
          >
            <QrCode className="w-5 h-5 mb-1" /> QR Code
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-sm"
          >
            <Share2 className="w-5 h-5 mb-1" /> Share
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
