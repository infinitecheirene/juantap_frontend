import type { ProfileData } from "@/lib/profile-data";
import { SocialLinkCard } from "@/components/profile/social-link-card";
import { ContactInfo } from "@/components/profile/contact-info";

interface ProfileContentProps {
  profile: ProfileData;
}

export function ProfileContent({ profile }: ProfileContentProps) {
  return (
    <div className="px-6 pb-6">
      {/* Contact Information */}
      {(profile.email || profile.phone) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
          <ContactInfo profile={profile} />
        </div>
      )}

      {/* Social Links */}
      {profile.socialLinks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Connect with me
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.socialLinks.map((link) => (
              <SocialLinkCard key={link.platform} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
