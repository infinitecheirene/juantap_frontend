import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Type, Layout, Smartphone } from 'lucide-react'
import { Template } from "@/types/template"

interface TemplatePreviewContentProps {
  template: Template
}

export function TemplatePreviewContent({ template }: TemplatePreviewContentProps) {
  return (
    <div className="space-y-8">
      {/* Template Preview */}
      <Card className="p-0 overflow-hidden">
        {/* You can add preview image or content here */}
      </Card>

      {/* Template Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Colors */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Color Palette</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[
              { label: "Primary", color: template?.colors?.primary ?? "#ddd" },
              { label: "Secondary", color: template?.colors?.secondary ?? "#ddd" },
              { label: "Accent", color: template?.colors?.accent ?? "#ddd" },
              { label: "Background", color: template?.colors?.background ?? "#ddd" },
              { label: "Text", color: template?.colors?.text ?? "#ddd" },
            ].map(({ label, color }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-200 mb-1 sm:mb-2"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] sm:text-xs text-gray-600 text-center break-words">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </Card>

        {/* Typography */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Typography</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Heading Font</span>
              <p className="text-lg font-semibold" style={{ fontFamily: template?.fonts?.heading ?? "sans-serif" }}>
                {template?.fonts?.heading ?? "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Body Font</span>
              <p className="text-base" style={{ fontFamily: template?.fonts?.body ?? "sans-serif" }}>
                {template?.fonts?.body ?? "N/A"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Features Included</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {(template?.features ?? []).length > 0 ? (
            (template?.features ?? []).map((feature: any) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No features listed.</span>
          )}
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(template?.tags ?? []).length > 0 ? (
            (template?.tags ?? []).map((tag: any) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-gray-500">No tags available.</span>
          )}
        </div>
      </Card>
    </div>
  )
}
