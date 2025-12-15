"use client";

import type { ProfileData } from "@/lib/profile-data";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Copy } from "lucide-react";
import { useState } from "react";

interface ContactInfoProps {
  profile: ProfileData;
}

export function ContactInfo({ profile }: ContactInfoProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-3">
      {profile.email && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-sm text-gray-600">{profile.email}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(profile.email!, "email")}
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
            {copiedField === "email" ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}

      {profile.phone && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">Phone</div>
              <div className="text-sm text-gray-600">{profile.phone}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(profile.phone!, "phone")}
            className="text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
            {copiedField === "phone" ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  );
}
