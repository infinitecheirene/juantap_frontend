import { TemplateData } from "@/types/template"
import React from "react"

interface AnimatedBackgroundProps {
  template: TemplateData
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ template }) => {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-pulse" style={{ background: template.colors?.primary ?? "transparent" }} />
      <div className="absolute top-20 right-20 w-1 h-1 rounded-full animate-ping" style={{ background: template.colors?.primary ?? "transparent" }} />
      <div className="absolute bottom-20 left-20 w-3 h-3 rounded-full animate-bounce" style={{ background: template.colors?.primary ?? "transparent" }} />
      <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full animate-pulse delay-1000" style={{ background: template.colors?.primary ?? "transparent" }} />
      <div className="absolute bottom-10 right-1/3 w-1 h-1 rounded-full animate-ping delay-500" style={{ background: template.colors?.primary ?? "transparent" }} />
    </div>
  )
}
