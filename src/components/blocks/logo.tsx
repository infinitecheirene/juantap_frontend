import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ variant = "light", className }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Gradient Circle with JT */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center">
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
