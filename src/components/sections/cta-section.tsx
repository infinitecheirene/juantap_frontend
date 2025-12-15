"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = (btnName: string, href: string) => {
    setLoadingBtn(btnName);
    router.push(href);
  };

  const getLink = () => (isLoggedIn ? "/templates" : "/register");

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
          Ready to Create Your Digital Identity?
        </h2>

        <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
          Join thousands of users who are already networking smarter with
          JuanTap. Create your profile in minutes and start sharing instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            onClick={() => handleClick("getStarted", getLink())}
            disabled={loadingBtn === "getStarted"}
          >
            {loadingBtn === "getStarted" ? (
              "Loading..."
            ) : (
              <>
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 text-purple-700 border-purple-300 bg-white/50 backdrop-blur-sm hover:bg-purple-50 hover:border-purple-400 rounded-full transition-all duration-300 hover:shadow-md"
            onClick={() => handleClick("viewExamples", getLink())}
            disabled={loadingBtn === "viewExamples"}
          >
            {loadingBtn === "viewExamples" ? "Loading..." : "View Examples"}
          </Button>
        </div>
      </div>
    </section>
  );
}
