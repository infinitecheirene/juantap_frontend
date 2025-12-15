import type { SocialLink } from "@/lib/profile-data";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { getSocialIcon } from "@/lib/social-icons";

interface SocialLinkCardProps {
  link: SocialLink;
}

export function SocialLinkCard({ link }: SocialLinkCardProps) {
  const Icon = getSocialIcon(link.icon);

  return (
    <Button
      variant="outline"
      className="w-full justify-start h-auto p-4 hover:bg-gray-50 transition-colors group bg-transparent"
      asChild
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">{link.platform}</div>
              <div className="text-sm text-gray-500">{link.username}</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </div>
      </a>
    </Button>
  );
}
