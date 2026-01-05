"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Palette, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function TemplateHeader() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/");
      return;
    }
    const user = JSON.parse(userData);

    console.log("user admin ", user.is_admin);

    if (!user.is_admin) {
      router.push("/templates/");
    } else {
      router.push("/admin/");
    }
  }, [router]);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Floating particles (reused from Hero) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
      </div>

      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 container mx-auto text-center max-w-4xl">
        <Badge
          variant="secondary"
          className="mb-6 mx-auto flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-200 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
        >
          <Palette className="w-4 h-4 text-pink-300" />
          Premium Templates
        </Badge>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          Stand Out with
          <br />
          Premium Designs
        </h1>

        <p className="text-xl md:text-2xl text-purple-100/90 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Choose from our collection of professionally designed templates. From
          minimalist to bold, find the perfect style that represents your unique
          personality and brand.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Premium Quality</span>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Unique Designs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
