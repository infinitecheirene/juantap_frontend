import { StepCard } from "@/components/blocks/step-card";

const steps = [
  {
    step: 1,
    title: "Create Your Profile",
    description:
      "Sign up and add your personal information, bio, and profile picture to get started.",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    step: 2,
    title: "Choose & Add Links",
    description:
      "Choose a template and add all your social media and contact links.",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    step: 3,
    title: "Share & Connect",
    description:
      "Generate your QR code and start sharing your digital profile with the world instantly.",
    gradient: "from-pink-600 to-red-600",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse"></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-xl text-purple-50">
            Create your digital profile in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
