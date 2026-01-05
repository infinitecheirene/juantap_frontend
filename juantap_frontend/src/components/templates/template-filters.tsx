"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TemplateFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function TemplateFilters({
  searchQuery,
  setSearchQuery,
}: TemplateFiltersProps) {
  const pathname = usePathname();

  return (
    <div className="mb-12">
      {/* Back Button + Heading (only on /dashboard) */}
      {pathname === "/dashboard" && (
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Templates</h1>
            <p className="text-gray-600">
              View and manage your saved and purchased templates.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
