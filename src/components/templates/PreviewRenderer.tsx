import React from "react"
import { CreativeLayout } from "./layout/creative"
import { ProfessionalLayout } from "./layout/professional"
import { TemplateData } from "@/types/template"
import { User } from "@/types/user"

interface PreviewRendererProps {
  template: TemplateData
  user?: User
  slug?: string
}

const PreviewRenderer: React.FC<PreviewRendererProps> = ({ template, user, slug }) => {
  if (!template) return null // handle missing template

  switch (template.layout) {
    case "creative":
      return <CreativeLayout template={template} user={user} slug={slug} />
    case "professional":
      return <ProfessionalLayout template={template} user={user} slug={slug} />
    default:
      return <div>Layout not supported</div>
  }
}

export default PreviewRenderer
