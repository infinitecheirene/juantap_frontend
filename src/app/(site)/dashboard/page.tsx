// app/template-gallery-server.tsx
"use client"

import { useEffect, useState } from "react";
import { TemplateGallery } from "../../../components/templates/template-gallery";
import { getUserTemplatesWithStatus } from "@/lib/template-data";
import { Template } from "@/types/template";

export default function TemplateGalleryServer() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const load = async () => {
      const userTemplates = await getUserTemplatesWithStatus();
      setTemplates(userTemplates.filter(t => t.status === "saved" || t.status === "bought"));
    };

    load();
  }, []);

  return <TemplateGallery templates={templates} />;
}