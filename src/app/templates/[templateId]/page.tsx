import { notFound } from "next/navigation"
import { getTemplateBySlug, getCurrentUser } from "@/lib/template-data"
import type { Template } from "@/lib/template-data"
import type { User } from "@/types/template"

import TemplatePreviewHeader from "./template-preview"
import TemplatePreviewContent from "./template-preview"
import TemplatePreviewSidebar from "./template-preview"

interface TemplatePageProps {
  params: {
    templateId: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await getTemplateBySlug(params.templateId)
  if (!template) notFound()

  const user = await getCurrentUser()

  return (
    <>
      <TemplatePreviewHeader template={template} user={user} />

      <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
        <main className="flex-1">
          <TemplatePreviewContent template={template} />
        </main>

        <aside className="hidden lg:block w-1/3">
          <TemplatePreviewSidebar template={template} />
        </aside>
      </div>
    </>
  )
}
