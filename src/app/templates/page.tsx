import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TemplateHeader } from "@/components/templates/template-header";
import TemplateGalleryServer from "@/components/templates/template-gallery-server";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main>
        <TemplateHeader />
        <TemplateGalleryServer />
      </main>
      <Footer />
    </div>
  );
}
