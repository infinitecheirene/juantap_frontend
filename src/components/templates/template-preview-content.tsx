import type { Template } from "@/lib/template-data";
import type { User } from "@/types/template";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Layout, Smartphone } from "lucide-react";

interface TemplatePreviewContentProps {
  template: Template;
  user?: User | null;
} 

export function TemplatePreviewContent({
  template,
}: TemplatePreviewContentProps) {
  return (
    <div className="space-y-6">
      {/* Template Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Colors */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Color Palette</h3>
          </div>

          <div className="grid grid-cols-5 gap-2 ml-4 pb-2">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                style={{ backgroundColor: template?.colors?.primary ?? "#ddd" }}
              />
              <span className="text-xs text-gray-600">Primary</span>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                style={{
                  backgroundColor: template?.colors?.secondary ?? "#ddd",
                }}
              />
              <span className="text-xs text-gray-600">Secondary</span>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                style={{ backgroundColor: template?.colors?.accent ?? "#ddd" }}
              />
              <span className="text-xs text-gray-600">Accent</span>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                style={{
                  backgroundColor: template?.colors?.background ?? "#ddd",
                }}
              />
              <span className="text-xs text-gray-600">Background</span>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                style={{ backgroundColor: template?.colors?.text ?? "#ddd" }}
              />
              <span className="text-xs text-gray-600">Text</span>
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Typography</h3>
          </div>
          <div className="space-y-2 ml-8">
            <div>
              <span className="text-sm text-gray-600">Heading Font</span>
              <p
                className=" text-gray-500 text-lg font-semibold"
                style={{ fontFamily: template?.fonts?.heading ?? "sans-serif" }}
              >
                {!template?.fonts?.heading ? "N/A" : template?.fonts?.heading}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Body Font</span>
              <p
                className="text-base"
                style={{ fontFamily: template?.fonts?.body ?? "sans-serif" }}
              >
                {!template?.fonts?.body ? "N/A" : template?.fonts?.body}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Features Included</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-2 ml-8 pb-2">
          {(template?.features ?? []).length > 0 ? (
            (template?.features ?? []).map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No features listed.</span>
          )}
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Tags</h3>
        </div>

        <div className="flex flex-wrap gap-2 ml-8 pb-2">
          {(template?.tags ?? []).length > 0 ? (
            (template?.tags ?? []).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="flex px-2 pb-1 items-center rounded-lg"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">No tags available.</span>
          )}
        </div>
      </Card>
    </div>
  );
}
