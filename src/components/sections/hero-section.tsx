"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { ProfilePreview } from "@/components/blocks/profile-preview";

export function HeroSection() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // track if we are still checking
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false); // finished checking
      }
    };

    fetchUser();

    const userData = localStorage.getItem("user");
    const data = userData ? JSON.parse(userData) : null;
    if (!userData) {
      router.push("/");
      return;
    }
    const user = JSON.parse(userData);

    console.log("user admin ", user.is_admin);

    if (!user.is_admin) {
      router.push("/dashboard/edit-profile");
    } else {
      router.push("/admin/");
    }
  }, [router]);

  // Don't render buttons until loading is done
  const linkHref = !loading && user ? "/templates" : "/register";

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen flex items-center">
      <div className="relative z-10 container mx-auto text-center max-w-4xl">
        <Badge
          variant="secondary"
          className="mb-6 mx-auto flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-purple-200 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
          Create Your Digital Identity
          <Zap className="w-4 h-4 animate-pulse text-purple-300" />
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
          Your Digital Profile,
          <br />
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
            One Tap Away
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-100/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Create stunning, personalized digital profiles with social links,
          custom designs, and instant sharing via QR codes or NFC. Perfect for
          networking, business cards, and social media.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link href={linkHref} onClick={() => setLoadingBtn("create")}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center gap-2"
            >
              {loadingBtn === "create" ? "Loading..." : "Create Your Profile"}
              <ArrowRight className="w-5 h-5 ml-2 mt-1 animate-bounce" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            disabled={!user?.username || loading || loadingBtn === "view"}
            onClick={(e) => {
              if (!user?.username) {
                e.preventDefault();
                alert("Set a username first in Edit Profile.");
                return;
              }
              setLoadingBtn("view");
              window.location.href = `/${user.username}`;
            }}
            className={`text-lg px-10 py-4 rounded-full border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm 
              ${
                !user?.username || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/20 hover:scale-105 transition-all duration-300"
              } flex items-center justify-center gap-2`}
          >
            {loadingBtn === "view" ? "Loading..." : "View Public Profile"}
          </Button>
        </div>

        {user && (
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-3xl blur-xl"></div>
            <div className="relative">
              <ProfilePreview user={user} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
