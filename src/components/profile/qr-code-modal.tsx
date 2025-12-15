"use client";

import type { ProfileData } from "@/lib/profile-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Copy } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
}

export function QRCodeModal({ isOpen, onClose, profile }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${
          profile.username || profile.displayName || ""
        }`
      : "";

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Download QR code as PNG
  const downloadQR = () => {
    try {
      const svg = document.getElementById(
        "qr-code-svg"
      ) as SVGSVGElement | null;
      if (!svg) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${profile.username || "profile"}-qrcode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = url;
    } catch (err) {
      alert("Failed to download QR code");
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code for {profile.username || profile.displayName || "Profile"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG
            id="qr-code-svg"
            value={profileUrl}
            size={192}
            level="H"
            imageSettings={{
              src: "/logo.png", // Optional: your logo here
              height: 40,
              width: 40,
              excavate: true,
            }}
            className="border border-gray-300 rounded-lg"
          />

          {/* URL Display */}
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
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={downloadQR}
              className="flex-1 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
