"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Gradient Circle with JT */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center jus
      tify-center">
        <span className="text-white font-serif font-bold text-sm">JT</span>
      </div>

      {/* Gradient JuanTap text */}
      <span
        className={cn(
          "text-xl font-bold", // <- changed from font-semibold to font-bold
          variant === "light"
            ? "bg-gradient-to-r from-cyan-500 to-indigo-300 bg-clip-text text-transparent"
            : "text-white"
        )}
      >
        JuanTap
      </span>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl overflow-hidden border-0">
        {/* Header */}
        <CardHeader className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-lg font-bold">
            Terms and Conditions
          </CardTitle>
          <button
            className="text-white hover:text-gray-200 transition"
            onClick={() => window.history.back()}
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        {/* Logo + Intro */}
        <div className="text-center px-6 pt-6">
          <Link href="/" className="inline-block mb-4">
            <Logo className="mx-auto h-12 w-auto" />
          </Link>
          <p className="text-gray-700 text-sm">
            Welcome to JuanTap! By usivccxng our services, you agree to the
            following terms:
          </p>
        </div>

        {/* Content */}
        <CardContent className="max-h-[60vh] overflow-y-auto px-6 pt-4 pb-6 space-y-4">
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
            <li>You must be at least 13 years old to use our platform.</li>
            <li>All information provided must be accurate and up-to-date.</li>
            <li>You are responsible for keeping your account secure.</li>
            <li>Do not use our platform for illegal or harmful activities.</li>
            <li>
              We reserve the right to suspend or terminate accounts that violate
              these terms.
            </li>
            <li>
              Your data is protected and used in accordance with our privacy
              policy.
            </li>
          </ul>

          <p className="text-gray-500 text-xs text-center mt-4">
            These terms may be updated at any time. Continued use of the
            platform constitutes your acceptance of the updated terms.
          </p>

          <p className="mt-2 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} JuanTap. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
