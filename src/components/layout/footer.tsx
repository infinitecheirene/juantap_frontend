import Link from "next/link";
import { Logo } from "@/components/blocks/logo";
import { TermsModal } from "@/components/auth/TermsModal";

interface FooterSection {
  title: string;
  links: Array<{
    href: string;
    label: string;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { href: "#", label: "Features" },
      { href: "#", label: "Templates" },
      { href: "#", label: "Pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "#", label: "Help Center" },
      { href: "#", label: "Contact Us" },
    ],
  },
  {
    title: "User Agreement",
    links: [{ href: "#", label: "Terms of Service" }],
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo variant="dark" />
            </div>
            <p className="text-purple-200/80">
              Create and share your digital profile with the world. One tap,
              endless possibilities.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-purple-200/70">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.label === "Terms of Service" ? (
                      <TermsModal />
                    ) : (
                      <Link
                        href={link.href}
                        className="hover:text-pink-200 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-purple-200/60">
          <p>&copy; 2025 JuanTap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
