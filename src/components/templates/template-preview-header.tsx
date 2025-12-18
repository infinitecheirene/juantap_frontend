import type { Template } from "@/lib/template-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Star, Sparkles } from "lucide-react";
import Link from "next/link";

interface TemplatePreviewHeaderProps {
  template: Template;
}

export function TemplatePreviewHeader({
  template,
}: TemplatePreviewHeaderProps) {
  const isPremium = template.category === "premium";

  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {template.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {isPremium && (
                  <Badge className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {template.isNew && (
                  <Badge
                    variant="secondary"
                    className="text-2xl bg-green-100 text-green-700 border-green-200"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
                {template.isPopular && (
                  <Badge
                    variant="secondary"
                    className="text-2xl bg-yellow-100 text-yellow-700 border-yellow-200"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="text-left sm:text-right">
            {isPremium ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                {template.originalPrice && template.discount ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      ₱{template.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ₱{template.originalPrice}
                    </span>
                    <Badge variant="destructive" className="bg-red-500">
                      -{template.discount}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    ₱{template.price}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold text-green-600">Free</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
