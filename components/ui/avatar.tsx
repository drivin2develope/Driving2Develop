import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PALETTE = ["#E3B341", "#60A5FA", "#A78BFA", "#34D399", "#FB923C", "#F87171"];

function hueFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % PALETTE.length;
  return PALETTE[h];
}

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const color = hueFor(name);
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full font-semibold shrink-0", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
