import type { ProfileData } from "@/lib/profile-data";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileContent } from "@/components/profile/profile-content";
import { ProfileActions } from "@/components/profile/profile-actions";

interface PublicProfileProps {
  profile: ProfileData;
}

export function PublicProfile({ profile }: PublicProfileProps) {
  const backgroundStyle = profile.template.backgroundColor.startsWith(
    "linear-gradient"
  )
    ? { background: profile.template.backgroundColor }
    : { backgroundColor: profile.template.backgroundColor };

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <ProfileHeader profile={profile} />
          <ProfileContent profile={profile} />
          <ProfileActions profile={profile} />
        </div>
      </div>
    </div>
  );
}
