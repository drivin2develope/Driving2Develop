import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "V4 Design Prototype (internal)",
  robots: { index: false, follow: false },
};

export default function V4PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
