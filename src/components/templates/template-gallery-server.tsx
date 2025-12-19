// app/(wherever)/TemplateGalleryServer.tsx
import { getAllTemplates } from "@/lib/template-data";
import { TemplateGallery } from "./template-gallery";

export default async function TemplateGalleryServer() {
  const templates = await getAllTemplates();
  return <TemplateGallery templates={templates} />;
}
