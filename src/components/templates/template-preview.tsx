
import { TemplatePreviewHeader } from "@/components/templates/template-preview-header"
import { TemplatePreviewContent } from "@/components/templates/template-preview-content"
import { TemplatePreviewSidebar } from "@/components/templates/template-preview-sidebar"
import { Template } from "@/types/template"

interface TemplatePreviewProps {
  template: Template
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TemplatePreviewHeader template={template} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TemplatePreviewContent template={template} />
          </div>
          <div className="lg:col-span-1">
            <TemplatePreviewSidebar template={template} />
          </div>
        </div>
      </div>
    </div>
  )
}
