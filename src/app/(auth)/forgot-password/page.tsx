import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Logo } from "@/components/blocks/logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-gray-600">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Forgot Password Form */}
        <ForgotPasswordForm />

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
