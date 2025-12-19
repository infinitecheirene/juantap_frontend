"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermsModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-purple-400 hover:text-pink-300 font-medium cursor-pointer no-underline transition-colors"
        >
          Terms of Service
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] rounded-2xl border-0 shadow-2xl overflow-hidden">
        {/* Header with Gradient */}
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-3xl">
          <DialogTitle className="text-lg font-bold">
            Terms of Service
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="h-[60vh] px-6 py-4 pr-4">
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Welcome to JuanTap! By using our services, you agree to the
              following terms:
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li>You must be at least 13 years old to use our platform.</li>
              <li>All information provided must be accurate and up-to-date.</li>
              <li>You are responsible for keeping your account secure.</li>
              <li>
                Do not use our platform for illegal or harmful activities.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these terms.
              </li>
              <li>
                Your data is protected and used in accordance with our privacy
                policy.
              </li>
            </ul>

            <p>
              These terms may be updated at any time. Continued use of the
              platform constitutes your acceptance of the updated terms.
            </p>
          </div>
        </ScrollArea>

        {/* Footer Button */}
        <div className="text-right px-6 py-4 border-t border-gray-200">
          <Button
            onClick={() => setOpen(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
