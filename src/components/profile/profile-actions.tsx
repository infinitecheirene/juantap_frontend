"use client";

import type { ProfileData } from "@/lib/profile-data";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Heart, Download } from "lucide-react";
import { useState } from "react";
import { QRCodeModal } from "@/components/profile/qr-code-modal";

interface ProfileActionsProps {
  profile: ProfileData;
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${profile.username}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} - JuanTap`,
          text: profile.bio || `Check out ${profile.displayName}'s profile`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    }
  };

  const handleSaveContact = () => {
    // Create vCard data
    const vCard = `BEGIN:VCARD
    VERSION:3.0
    FN:${profile.displayName}
    ${profile.email ? `EMAIL:${profile.email}` : ""}
    ${profile.phone ? `TEL:${profile.phone}` : ""}
    ${profile.website ? `URL:${profile.website}` : ""}
    END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.username}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="px-6 pb-6 border-t border-gray-100 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowQRCode(true)}
            className="flex flex-col items-center gap-2 h-auto py-3"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">QR Code</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            className="flex flex-col items-center gap-2 h-auto py-3 bg-transparent"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsLiked(!isLiked)}
            className={`flex flex-col items-center gap-2 h-auto py-3 ${
              isLiked ? "text-red-600 border-red-200 bg-red-50" : ""
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">Like</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleSaveContact}
            className="flex flex-col items-center gap-2 h-auto py-3 bg-transparent"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </div>

      <QRCodeModal
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        profile={profile}
      />
    </>
  );
}
