import { FeatureCard } from "@/components/blocks/feature-card";
import {
  QrCode,
  Palette,
  Share2,
  Smartphone,
  Users,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "QR Code & NFC Sharing",
    description:
      "Instantly share your profile with QR codes or NFC tap. Perfect for business cards and networking events.",
    color: "blue",
  },
  {
    icon: Palette,
    title: "Choose Design Templates",
    description:
      "Choose from beautiful templates and customize colors, fonts, backgrounds to match your brand.",
    color: "purple",
  },
  {
    icon: Share2,
    title: "Social Media Integration",
    description:
      "Connect all your social platforms - Instagram, LinkedIn, TikTok, WhatsApp, and more in one place.",
    color: "green",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Your profiles look perfect on any device. Responsive design ensures great user experience everywhere.",
    color: "orange",
  },
  {
    icon: Users,
    title: "Analytics & Insights",
    description:
      "Track profile views, link clicks, and engagement to understand your digital presence impact.",
    color: "pink",
  },
  {
    icon: Crown,
    title: "Premium Templates",
    description:
      "Unlock exclusive premium designs and advanced customization options for a unique look.",
    color: "indigo",
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-700 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-600 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-blue-700 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-gray-800 rounded-full animate-ping delay-500"></div>
      </div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent drop-shadow-sm">
            Everything You Need for Digital Networking
          </h2>
          <p className="text-xl text-purple-900/80 max-w-2xl mx-auto leading-relaxed font-light">
            Powerful features to create, customize, and share your digital
            presence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
