import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange" | "pink" | "indigo";
}

const colorVariants = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
  pink: "bg-pink-100 text-pink-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
            colorVariants[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
