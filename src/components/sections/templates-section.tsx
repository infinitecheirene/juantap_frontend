"use client";

import { useRouter } from "next/navigation";
import { PricingCard } from "@/components/blocks/pricing-card";
import { useEffect, useState } from "react";

export function TemplatesSection() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const user = JSON.parse(userData);

    console.log("user admin ", user.is_admin);

    if (!user.is_admin) {
      router.push("/");
    } else {
      router.push("/admin/");
    }
  }, [router]);

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
            <PricingCard key={plan.name} {...plan} loadingBtn={loadingBtn ?? undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
