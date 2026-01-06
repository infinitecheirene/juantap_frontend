"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfilePreview } from "@/components/blocks/profile-preview";
import { FeatureCard } from "@/components/blocks/feature-card";
import { StepCard } from "@/components/blocks/step-card";
import { PricingCard } from "@/components/blocks/pricing-card";
import {
  ArrowRight,
  Zap,
  Sparkles,
  QrCode,
  Palette,
  Share2,
  Smartphone,
  Users,
  Crown,
} from "lucide-react";

export function HeroSection() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // track if we are still checking
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false); // finished checking
      }
    };

    fetchUser();
  }, []);

  // Don't render buttons until loading is done
  const linkHref = !loading && user ? "/templates" : "/register";

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen flex items-center">
      <div className="relative z-10 container mx-auto text-center max-w-4xl">
        <Badge
          variant="secondary"
          className="mb-6 mx-auto flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-200 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
          Create Your Digital Identity
          <Zap className="w-4 h-4 animate-pulse text-purple-300" />
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          Your Digital Profile,
          <br />
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
            One Tap Away
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-100/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Create stunning, personalized digital profiles with social links,
          custom designs, and instant sharing via QR codes or NFC. Perfect for
          networking, business cards, and social media.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link href={linkHref} onClick={() => setLoadingBtn("create")}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
            >
              {loadingBtn === "create" ? "Loading..." : "Create Your Profile"}
              <ArrowRight className="w-5 h-5 ml-2 mt-1 animate-bounce" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            disabled={!user?.username || loading || loadingBtn === "view"}
            onClick={(e) => {
              if (!user?.username) {
                e.preventDefault();
                alert("Set a username first in Edit Profile.");
                return;
              }
              setLoadingBtn("view");
              window.location.href = `/${user.username}`;
            }}
            className={`text-lg px-10 py-4 rounded-full border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm 
              ${
                !user?.username || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/20 hover:scale-105 transition-all duration-300"
              } flex items-center justify-center gap-2`}
          >
            {loadingBtn === "view" ? "Loading..." : "View Public Profile"}
          </Button>
        </div>

        {user && (
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-3xl blur-xl"></div>
            <div className="relative">
              <ProfilePreview user={user} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

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

const steps = [
  {
    step: 1,
    title: "Create Your Profile",
    description:
      "Sign up and add your personal information, bio, and profile picture to get started.",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    step: 2,
    title: "Choose & Add Links",
    description:
      "Choose a template and add all your social media and contact links.",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    step: 3,
    title: "Share & Connect",
    description:
      "Generate your QR code and start sharing your digital profile with the world instantly.",
    gradient: "from-pink-600 to-red-600",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse"></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-purple-50">
            Create your digital profile in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TemplatesSection() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<string | undefined>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleButtonClick = (planName: string) => {
    setLoadingBtn(planName);

    if (isLoggedIn) {
      router.push("/templates");
    } else {
      router.push("/register");
    }
  };

  const pricingPlans = [
    {
      name: "Free Templates",
      description: "Perfect for getting started",
      price: "Free",
      priceColor: "text-green-700",
      features: [
        "2+ Beautiful Templates",
        "Basic Customization",
        "QR Code Generation",
        "Social Media Links",
        "Mobile Responsive",
      ],
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      buttonClass: "bg-transparent",
      onClick: () => handleButtonClick("Free Templates"),
    },
    {
      name: "Premium Templates",
      description: "Stand out with exclusive designs",
      price: "₱299",
      priceSubtext: "one-time payment per template",
      priceColor:
        "bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent",
      features: [
        "20+ Exclusive Templates",
        "Advanced Customization",
        "Custom Backgrounds",
        "Premium Animations",
        "Priority Support",
      ],
      buttonText: "Unlock Premium",
      buttonVariant: "default" as const,
      buttonClass:
        "bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800",
      badge: "Most Popular",
      borderClass: "border-2 border-purple-400 hover:border-purple-500",
      iconColor: "text-purple-600",
      onClick: () => handleButtonClick("Premium Templates"),
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 px-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent drop-shadow-sm">
            Choose Your Template Style
          </h2>
          <p className="text-xl text-purple-900/80 max-w-2xl mx-auto leading-relaxed font-light">
            Free templates to get started, premium designs to stand out
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} loadingBtn={loadingBtn} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = (btnName: string, href: string) => {
    setLoadingBtn(btnName);
    router.push(href);
  };

  const getLink = () => (isLoggedIn ? "/templates" : "/register");

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
          Ready to Create Your Digital Identity?
        </h2>

        <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of users who are already networking smarter with
          JuanTap. Create your profile in minutes and start sharing instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            onClick={() => handleClick("getStarted", getLink())}
            disabled={loadingBtn === "getStarted"}
          >
            {loadingBtn === "getStarted" ? (
              "Loading..."
            ) : (
              <>
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 text-purple-700 border-purple-300 bg-white/50 backdrop-blur-sm hover:bg-purple-50 hover:border-purple-400 rounded-full transition-all duration-300 hover:shadow-md"
            onClick={() => handleClick("viewExamples", getLink())}
            disabled={loadingBtn === "viewExamples"}
          >
            {loadingBtn === "viewExamples" ? "Loading..." : "View Examples"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <CTASection />
    </div>
  );
}
