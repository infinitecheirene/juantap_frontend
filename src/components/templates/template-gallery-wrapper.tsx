// src/components/templates/template-gallery-wrapper.tsx
"use client";

import { TemplateGallery } from "./template-gallery";
import type { Template } from "@/types/template";

interface WrapperProps {
  templates: Template[];
}

export default function TemplateGalleryWrapper({ templates }: WrapperProps) {
  return <TemplateGallery templates={templates} />;
}
