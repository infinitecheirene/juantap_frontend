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

export function RetroVintage() {
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
            backgroundColor: data.profile?.background_value || "#2d1b69",
            textColor: data.profile?.textColor || "#ffffff",
            fontFamily: data.profile?.font_style || "'Righteous', cursive",
            primary: data.profile?.primary || "#ff6b9d",
            secondary: data.profile?.secondary || "#c44569",
            accent: data.profile?.accent || "#f8b500",
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

  const primary = profile?.template?.primary || "#ff6b9d";
  const secondary = profile?.template?.secondary || "#c44569";
  const accent = profile?.template?.accent || "#f8b500";
  const bg = profile?.template?.backgroundColor || "#2d1b69";
  const text = profile?.template?.textColor || "#ffffff";
  const font = profile?.template?.fontFamily || "'Righteous', cursive";

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
      <div
        className="w-full max-w-xs rounded-2xl overflow-hidden border transition transform duration-300 hover:scale-105"
        style={{
          background: `rgba(45, 27, 105, 0.95)`,
          borderColor: primary,
          boxShadow: `0 0 30px ${primary}80, 0 0 60px ${accent}60`,
        }}
      >
        {/* Cover Image / Neon Banner */}
        <div
          className="h-28 w-full"
          style={{
            background: profile?.coverImage
              ? `url(${profile.coverImage}) center/cover`
              : `linear-gradient(135deg, ${primary}, ${secondary})`,
          }}
        >
          {!profile?.coverImage && (
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
            className="w-24 h-24 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center"
            style={{
              borderColor: bg,
              backgroundColor: secondary,
              boxShadow: `0 0 25px ${accent}, 0 0 50px ${primary}50`,
            }}
          >
            {profile?.avatar ? (
              <img
                src={`${imageUrl}/storage/${profile.avatar}`}
                alt={profile.displayName || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={48}
                strokeWidth={1.5}
                className="text-white/80"
                style={{
                  filter: `drop-shadow(0 0 10px ${accent}) drop-shadow(0 0 15px ${primary})`,
                }}
              />
            )}
          </div>

          {/* Online Status */}
          <span
            className="absolute top-16 right-[30%] text-black text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 15px ${accent}`,
              textShadow: `0 0 5px rgba(0,0,0,0.8)`,
            }}
          >
            LIVE
          </span>

          {/* Name & Bio */}
          <h1
            className="mt-4 text-lg font-bold"
            style={{
              color: primary,
              textShadow: `0 0 10px ${primary}, 0 0 20px ${accent}`,
            }}
          >
            {profile?.displayName || "Display Name"}
          </h1>

          {profile?.location && (
            <p className="flex items-center gap-1 text-xs opacity-80 mt-1">
              <MapPin size={12} style={{ color: accent }} />
              {profile.location}
            </p>
          )}

          {profile?.bio && (
            <p className="mt-2 text-xs opacity-80 text-center leading-snug">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Section */}
        {(profile?.email || profile?.phone || profile?.website) && (
          <>
            <div
              className="border-t mt-4 mx-6"
              style={{ borderColor: primary }}
            ></div>
            <div className="px-6 py-3 space-y-2">
              <h3
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: accent,
                  textShadow: `0 0 5px ${accent}`,
                }}
              >
                Contact
              </h3>

              {profile?.email && (
                <div
                  className="flex items-center justify-between rounded-lg p-2 text-xs border"
                  style={{
                    background: `rgba(255, 107, 157, 0.1)`,
                    borderColor: `${primary}50`,
                    boxShadow: `inset 0 0 10px ${primary}20`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: primary }} />
                    <span className="opacity-90">{profile.email}</span>
                  </div>

                  <button
                    className="opacity-60 hover:opacity-100 transition"
                    onClick={() => copyToClipboard(profile.email!)}
                    style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              )}

              {profile?.phone && (
                <div
                  className="flex items-center justify-between rounded-lg p-2 text-xs border"
                  style={{
                    background: `rgba(196, 69, 105, 0.1)`,
                    borderColor: `${secondary}50`,
                    boxShadow: `inset 0 0 10px ${secondary}20`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: secondary }} />
                    <span className="opacity-90">{profile.phone}</span>
                  </div>

                  <button
                    className="opacity-60 hover:opacity-100 transition"
                    onClick={() => copyToClipboard(profile.phone!)}
                    style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              )}

              {profile?.website && (
                <div
                  className="flex items-center gap-2 rounded-lg p-2 text-xs border"
                  style={{
                    background: `rgba(248, 181, 0, 0.1)`,
                    borderColor: `${accent}50`,
                    boxShadow: `inset 0 0 10px ${accent}20`,
                  }}
                >
                  <Globe size={14} style={{ color: accent }} />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline opacity-90 hover:opacity-100 transition"
                    style={{ color: accent }}
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </>
        )}

        {/* Social Links */}
        {(profile?.socialLinks?.length ?? 0) > 0 && (
          <>
            <div
              className="border-t mx-6"
              style={{ borderColor: primary }}
            ></div>
            <div className="px-6 py-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{
                  color: secondary,
                  textShadow: `0 0 5px ${secondary}`,
                }}
              >
                Social
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
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
                        className="flex items-center gap-2 px-3 py-1 text-xs rounded-full hover:scale-105 transition transform"
                        style={{
                          backgroundColor: primary,
                          color: "#fff",
                          boxShadow: `0 0 15px ${accent}60, inset 0 0 10px rgba(255,255,255,0.2)`,
                        }}
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
        <div
          className="border-t"
          style={{
            borderColor: primary,
            background: `rgba(45, 27, 105, 0.8)`,
          }}
        >
          <div className="flex justify-around p-3">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex flex-col items-center text-xs hover:scale-110 transition transform font-bold"
              style={{
                color: primary,
                textShadow: `0 0 5px ${primary}`,
              }}
            >
              <QrCode className="w-4 h-4 mb-1" />
              <span>QR</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center text-xs hover:scale-110 transition transform font-bold"
              style={{
                color: secondary,
                textShadow: `0 0 5px ${secondary}`,
              }}
            >
              <Share2 className="w-4 h-4 mb-1" />
              <span>SHARE</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent
          className="sm:max-w-md border-4 rounded-2xl"
          style={{
            background: `rgba(45, 27, 105, 0.98)`,
            borderColor: primary,
            boxShadow: `0 0 40px ${primary}80, 0 0 80px ${accent}60`,
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2 font-bold text-lg"
              style={{
                color: primary,
                textShadow: `0 0 15px ${primary}, 0 0 30px ${accent}`,
                fontFamily: font,
              }}
            >
              <QrCode className="w-6 h-6" /> RETRO QR: {profile.displayName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div
              className="p-4 rounded-2xl border-4"
              style={{
                borderColor: accent,
                boxShadow: `0 0 30px ${accent}60, inset 0 0 20px rgba(248, 181, 0, 0.1)`,
                background: "rgba(255,255,255,0.95)",
              }}
            >
              <QRCodeSVG
                value={profileUrl}
                size={200}
                level="H"
                fgColor="#2d1b69"
                bgColor="#ffffff"
                imageSettings={{
                  src: "/logo.png",
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            </div>

            <div
              className="w-full p-4 rounded-xl border-2"
              style={{
                background: `rgba(255, 107, 157, 0.1)`,
                borderColor: `${primary}60`,
                boxShadow: `inset 0 0 20px ${primary}20`,
              }}
            >
              <p
                className="text-sm mb-2 font-bold uppercase tracking-wide"
                style={{
                  color: accent,
                  textShadow: `0 0 5px ${accent}`,
                }}
              >
                Profile URL:
              </p>

              <div className="flex items-center justify-between">
                <code className="text-sm opacity-90 truncate flex-1 mr-2">
                  {profileUrl}
                </code>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyUrl}
                  className="font-bold hover:scale-105 transition transform"
                  style={{
                    color: primary,
                    border: `2px solid ${primary}60`,
                    textShadow: `0 0 5px ${primary}`,
                  }}
                >
                  {copied ? "COPIED!" : "COPY"}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 font-bold text-sm hover:scale-105 transition transform border-2"
                style={{
                  borderColor: secondary,
                  color: secondary,
                  textShadow: `0 0 3px ${secondary}`,
                }}
              >
                <Download className="w-4 h-4 mr-2" /> DOWNLOAD
              </Button>

              <Button
                onClick={() => setIsQRModalOpen(false)}
                className="flex-1 font-bold text-sm hover:scale-105 transition transform border-2"
                style={{
                  background: primary,
                  color: "#ffffff",
                  borderColor: accent,
                  boxShadow: `0 0 20px ${primary}60`,
                  textShadow: `0 0 5px rgba(0,0,0,0.8)`,
                }}
              >
                CLOSE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
