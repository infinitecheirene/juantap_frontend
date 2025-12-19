"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Globe, Copy, Instagram, Twitter, Linkedin, Github, Youtube, Music, Facebook } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface MinimalCleanProps {
  socialStyle?: "default" | "circles" | "fullblock" | string
  connectStyle?: "grid" | "list" | "compact" | string
}

export function MinimalClean({
  socialStyle = "default",
  connectStyle = "grid",
}: MinimalCleanProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fixed colors for pure black design
  const colors = {
    primary: "#000000",
    secondary: "#6b7280",
    accent: "#ffffff",
    background: "#000000",
    text: "#ffffff",
    line: "#ffffff",
  }

  const fonts = {
    heading: "Inter",
    body: "Inter",
  }

  const staticProfile = {
    displayName: "MICHAEL GARCIA",
    position: "POSITION HERE",
    location: "Manila PH",
    handle: "@username",
    bio: "this is bio",
    email: "admin.example@gmail.com",
    phone: "012.345.678",
    website: "michaelgarcia.com",
    socialLinks: [
      { id: "instagram", platform: "instagram", username: "instagram_account", url: "https://instagram.com/2eub2e" },
      { id: "facebook", platform: "facebook", username: "facebook_account", url: "https://facebook.com" },
    ],
  }

  const profileUrl = "https://example.com/michael-garcia"

  const socialIconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    github: <Github size={16} />,
    youtube: <Youtube size={16} />,
    tiktok: <Music size={16} />,
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's something interesting for you.",
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      alert("Sharing is not supported on this browser.")
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getSocialLinkClass = () => {
    switch (socialStyle) {
      case "circles":
        return "flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition"
      case "fullblock":
        return "flex items-center gap-3 rounded-lg p-4 text-sm hover:opacity-80 transition w-full"
      default:
        return "flex items-center gap-2 rounded-lg p-2 text-sm hover:opacity-80 transition"
    }
  }

  const getConnectGridClass = () => {
    switch (connectStyle) {
      case "list":
        return "flex flex-col gap-2"
      case "compact":
        return "flex flex-wrap gap-2"
      default:
        return "grid grid-cols-2 gap-3"
    }
  }

  return (
    <div className="w-full flex justify-center p-2 sm:p-6" style={{ backgroundColor: "#f9fafb" }}>
      <div
        className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden flex flex-col relative"
        style={{
          backgroundColor: colors.background,
          fontFamily: fonts.body,
        }}
      >
        {/* Banner */}
        <div
          className="w-full h-24 sm:h-32"
          style={{
            backgroundColor: colors.primary,
          }}
        />

        {/* Avatar Section with horizontal line */}
        <div className="relative flex flex-col items-center px-4 sm:px-6 pb-4">
          <div
            className="absolute left-0 right-0"
            style={{
              backgroundColor: colors.line,
              height: "3px",
              top: "30%",
            }}
          />

          {/* Avatar */}
          <div
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center relative z-10 -mt-12 sm:-mt-16"
            style={{ borderColor: colors.primary }}
          >
            <img src="/images/image.png" alt="profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name with gray background */}
        <div
          className="w-full text-center py-3 sm:py-4 px-4"
          style={{
            backgroundColor: colors.secondary,
          }}
        >
          <h1
            className="text-lg sm:text-xl font-bold"
            style={{
              fontFamily: fonts.heading,
              color: colors.text,
            }}
          >
            {staticProfile.displayName}
          </h1>
        </div>

        {/* Position */}
        <div className="w-full text-center py-2 sm:py-3 px-4">
          <p
            className="text-xs sm:text-sm"
            style={{
              fontFamily: fonts.body,
              color: colors.text,
            }}
          >
            {staticProfile.position}
          </p>
        </div>

        {/* Contact Section */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2
            className="text-xs sm:text-sm font-semibold uppercase"
            style={{
              color: colors.secondary,
              fontFamily: fonts.heading,
            }}
          >
            Contact
          </h2>

          {/* Email */}
          <div
            className="flex justify-between items-center rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
            style={{
              backgroundColor: `${colors.primary}10`,
              fontFamily: fonts.body,
            }}
          >
            <div className="flex items-center gap-2 truncate" style={{ color: colors.text }}>
              <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" style={{ color: colors.accent }} />
              <span className="truncate">{staticProfile.email}</span>
            </div>
            <button
              className="hover:opacity-70 flex-shrink-0"
              style={{ color: colors.secondary }}
              onClick={() => navigator.clipboard.writeText(staticProfile.email)}
            >
              <Copy size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Phone */}
          <div
            className="flex justify-between items-center rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
            style={{
              backgroundColor: `${colors.primary}10`,
              fontFamily: fonts.body,
            }}
          >
            <div className="flex items-center gap-2 truncate" style={{ color: colors.text }}>
              <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" style={{ color: colors.accent }} />
              <span className="truncate">{staticProfile.phone}</span>
            </div>
            <button
              className="hover:opacity-70 flex-shrink-0"
              style={{ color: colors.secondary }}
              onClick={() => navigator.clipboard.writeText(staticProfile.phone)}
            >
              <Copy size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Website */}
          <div
            className="flex justify-between items-center rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
            style={{
              backgroundColor: `${colors.primary}10`,
              fontFamily: fonts.body,
            }}
          >
            <div className="flex items-center gap-2 truncate" style={{ color: colors.text }}>
              <Globe size={14} className="sm:w-4 sm:h-4 flex-shrink-0" style={{ color: colors.accent }} />
              <a
                href={`https://${staticProfile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate underline hover:opacity-70"
              >
                {staticProfile.website}
              </a>
            </div>
            <button
              className="hover:opacity-70 flex-shrink-0"
              style={{ color: colors.secondary }}
              onClick={() => navigator.clipboard.writeText(staticProfile.website)}
            >
              <Copy size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div
          className="flex items-center border-t p-4 sm:p-6 gap-3"
          style={{
            backgroundColor: `${colors.primary}08`,
            borderColor: `${colors.primary}20`,
            fontFamily: fonts.body,
          }}
        >
          {/* QR Code (Left) */}
          <div className="flex flex-col items-center flex-shrink-0">
            <QRCodeSVG value={profileUrl} size={80} />
            <p className="text-[10px] sm:text-xs mt-1" style={{ color: colors.secondary }}>
              QR Code
            </p>
          </div>

          {/* Social Icons (Right of QR) - Arranged Vertically */}
          <div className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
            {staticProfile.socialLinks.map((link) => {
              const platformKey = link.platform.toLowerCase()
              const icon = socialIconMap[platformKey] || <Globe size={14} />
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    color: colors.accent,
                  }}
                  title={link.username}
                >
                  {icon}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinimalClean
