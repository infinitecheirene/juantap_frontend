"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Eye, Star, User as UserIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PreviewRenderer } from "@/components/templates/PreviewRenderer";
import type { Template, User } from "@/types/template";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
  template: Template;
  user?: User | null;
}

export function TemplateCard({ template, user }: TemplateCardProps) {
  const router = useRouter();
  const isPremium = template.category === "premium";
  const hasDiscount = !!(template.original_price && template.discount);
  const [showRealPreview, setShowRealPreview] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handlePreviewClick = () => {
    setLoadingPreview(true);
    router.push(`/template-by-id/${template.slug}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRealPreview(true);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card className="group flex  flex-1 hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <div className="relative w-full h-full">
        {/* Template Preview or Thumbnail */}
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
          {showRealPreview ? (
            <PreviewRenderer
              template={template}
              user={user}
              slug={template.slug}
            />
          ) : (
            <img
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.name}
              className="w-full h-full object-cover blur-sm scale-105"
            />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isPremium && (
            <Badge className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Crown className="w-5 h-5 mr-1" />
              Premium
            </Badge>
          )}

          {template.isNew && (
            <Badge
              variant="secondary"
              className="p-1.5 rounded-lg bg-green-100 text-green-700 border-green-200"
            >
              <Sparkles className="w-5 h-5 mr-1" />
              New
            </Badge>
          )}

          {template.isPopular && (
            <Badge
              variant="secondary"
              className="p-1.5 rounded-lg bg-yellow-100 text-yellow-700 border-yellow-200"
            >
              <Star className="w-5 h-5 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {isPremium && hasDiscount && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="p-1.5 rounded-xl bg-red-500">
              -{template.discount}%
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={loadingPreview}
              onClick={handlePreviewClick}
              className="flex items-center gap-1"
            >
              {loadingPreview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>Preview</span>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="w-full h-full ">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
            {template.name}
          </h3>
        </div>

        <p className="h-[40px] text-sm text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="p-1.5 rounded-lg text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          {/* 👤 Author Info */}
          <div className="flex items-center gap-2">
            {template.user?.avatar_url ? (
              <img
                src={template.user.avatar_url}
                alt={template.user.name || "Author"}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none"; // hide broken image
                }}
              />
            ) : (
              <UserIcon size={24} className="text-gray-400" />
            )}
          </div>

          {/* 📊 Price + Button */}
          <div className="flex items-center gap-2">
            {isPremium ? (
              hasDiscount ? (
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-gray-900">
                    ₱{template.price}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₱{template.original_price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ₱{template.price}
                </span>
              )
            ) : (
              <span className="text-lg font-bold text-green-600">Free</span>
            )}

            <Link href={`/template-by-id/${template.slug}`}>
              <Button
                size="sm"
                className={
                  isPremium
                    ? "p-2 pl-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600"
                    : "p-2 pl-2 rounded-lg "
                }
              >
                {isPremium ? "Get Premium" : "Use Free"}
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
