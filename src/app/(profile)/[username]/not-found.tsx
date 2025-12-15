import { Button } from "@/components/ui/button";
import { Logo } from "@/components/blocks/logo";
import Link from "next/link";
import { UserX, Home, Search } from "lucide-react";

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-block mb-8">
          <Logo />
        </Link>

        <div className="mb-8">
          <UserX className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h1>
          
          <p className="text-gray-600 mb-6">
            The profile you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>

          <Link href="/templates">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Search className="w-4 h-4 mr-2" />
              Create Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
