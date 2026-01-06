import type { ProfileData } from "@/lib/profile-data";
import { MapPin, Globe, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      {profile.coverImage && (
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
          <img
            src={profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col items-center -mt-16 mb-4">
          <div className="relative">
            <img
              src={
                profile.avatar ||
                "/placeholder.svg?height=120&width=120&query=default+avatar"
              }
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            <div className="absolute -bottom-2 -right-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profile.displayName}
          </h1>

          {profile.bio && (
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 transition-colors"
              >
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {(profile.viewCount ?? 0).toLocaleString()} views
          </div>
        </div>
      </div>
    </div>
  );
}
