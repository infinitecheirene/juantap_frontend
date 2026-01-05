import type React from "react";
export interface NavigationItem {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: NavigationItem[];
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange" | "pink" | "indigo";
}

export interface Step {
  step: number;
  title: string;
  description: string;
  gradient: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  priceSubtext?: string;
  priceColor: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  buttonClass: string;
  badge?: string;
  borderClass?: string;
  iconColor?: string;
}
