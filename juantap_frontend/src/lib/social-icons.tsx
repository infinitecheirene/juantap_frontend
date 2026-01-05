import {
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  Music,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Facebook,
  Camera,
} from "lucide-react";

export function getSocialIcon(iconName: string) {
  const icons: Record<string, any> = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    youtube: Youtube,
    tiktok: Music,
    music: Music,
    website: Globe,
    email: Mail,
    phone: Phone,
    whatsapp: MessageCircle,
    facebook: Facebook,
    dribbble: Camera,
    behance: Camera,
    default: Globe,
  };

  return icons[iconName.toLowerCase()] || icons.default;
}
