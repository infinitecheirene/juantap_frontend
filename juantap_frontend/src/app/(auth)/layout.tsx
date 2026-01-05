import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - JuanTap",
  description: "Sign in or create your JuanTap account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
