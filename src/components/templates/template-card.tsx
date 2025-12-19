"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Eye, Star, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Template, TemplateData } from "@/types/template";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user";
import PreviewRenderer from "./PreviewRenderer";

interface TemplateCardProps {
  template: TemplateData;
  user?: User;
}

export function TemplateCard({ template, user }: TemplateCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard"); // ✅ detect if in dashboard

  const formatPrice = (value: number | string | undefined) => {
  if (!value) return "₱0.00";
  const num = Number(value);
  return (
    "₱" +
    num.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};


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
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden flex flex-col !m-0 !p-0">
  {/* Template Preview or Thumbnail */}
  <div className="relative w-full h-[420px] overflow-hidden !m-0 !p-0">
    {showRealPreview ? (
      <PreviewRenderer
        template={template}
        user={user}
        slug={template.slug}
      />
    ) : (
      <img
        src={template.thumbnail_url || "/placeholder.svg"}
        alt={template.name}
        className="w-full h-full object-cover"
      />
    )}
  

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isPremium && (
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {template.is_new && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
          {template.is_popular && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {isPremium && hasDiscount && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive" className="bg-red-500">
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

      <CardContent className="p-4 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
            {template.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags?.slice(0, 3).map((tag: any) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between w-full">
          {/* 👤 Author Avatar */}
          <div className="flex items-center gap-2">
            {template.user?.avatar_url && (
              <img
                src={template.user.avatar_url}
                alt={template.user.name || "Author"}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          {/* 📊 Stats + Price + Button */}
          <div className="flex items-center gap-2">
            {isPremium ? (
              hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(template.price as number)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(template.original_price as number)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(template.price as number)}
                </span>
              )
            ) : (
              <span className="text-lg font-bold text-green-600">Free</span>
            )}


            {/* ✅ Hide button in dashboard */}
            {!isDashboard && (
              <Link href={`/template-by-id/${template.slug}`}>
                <Button
                  size="sm"
                  className={`${
                    isPremium
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-black text-white"
                  }`}
                >
                  {isPremium ? "Get Premium" : "Use Free"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
