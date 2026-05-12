import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 32 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Top parallelogram - lightest blue */}
      <polygon points="16,6 38,6 32,18 10,18" fill="#7DD3FC" />
      {/* Middle parallelogram - medium blue */}
      <polygon points="12,16 34,16 28,28 6,28" fill="#38BDF8" />
      {/* Bottom parallelogram - deepest blue */}
      <polygon points="14,26 28,26 22,38 8,38" fill="#2563EB" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-lg" },
  lg: { icon: 48, text: "text-2xl" },
  xl: { icon: 72, text: "text-4xl" },
};

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={s.icon} />
      {showText && (
        <span className={cn("font-bold text-white tracking-tight", s.text)}>
          Futuristic
        </span>
      )}
    </div>
  );
}
