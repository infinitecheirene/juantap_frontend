import { getTemplateBySlug, getCurrentUser } from "@/lib/template-data"
import { notFound } from "next/navigation"
import { TemplatePreviewContent } from "@/components/templates/template-preview-content"
import { TemplatePreviewHeader } from "@/components/templates/template-preview-header"
import { TemplatePreviewSidebar } from "@/components/templates/template-preview-sidebar"

interface TemplatePageProps {
  params: {
    templateId: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await getTemplateBySlug(params.templateId)
  if (!template) notFound()

  // 🔑 fetch user (requires valid token)
  const user = await getCurrentUser()

  const { previewComponent: PreviewComponent, ...templateData } = template

  return (
    <>
      <header className="w-full bg-gray-50 px-6 py-4 shadow-sm">
        <TemplatePreviewHeader template={templateData} user={user} />
      </header>

      <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
        <main className="flex-1">
          <div className="my-6">
          </div>
          <div className="container mx-auto px-4 py-8">
            <TemplatePreviewContent template={templateData} user={user} />
          </div>
        </main>

        <div className="hidden lg:block w-1/3">
          <TemplatePreviewSidebar template={templateData} user={user} />
        </div>
      </div>
    </>
  )
}