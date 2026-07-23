import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "text-xl" : size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <Link to="/" className={cn("editorial-title inline-flex items-baseline gap-0.5 text-foreground", sizeClass, className)}>
      <span>Roteiriza</span>
      <span className="text-violet">.</span>
    </Link>
  );
}
