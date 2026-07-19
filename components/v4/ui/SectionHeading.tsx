import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  size = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  size?: "h1" | "h2";
}) {
  const Tag = size === "h1" ? "h1" : "h2";
  return (
    <div className={align === "center" ? "text-center mx-auto" : ""}>
      {eyebrow && <p className="v4-eyebrow mb-5">{eyebrow}</p>}
      <Tag
        className="font-semibold tracking-tight leading-[1.08]"
        style={{ fontSize: size === "h1" ? "var(--v4-text-display)" : "var(--v4-text-h2)" }}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-5 text-base" style={{ color: "var(--v4-text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
