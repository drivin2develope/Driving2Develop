import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { ThemeProvider, ThemeInitScript } from "@/components/ThemeProvider";

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Driven2Develop — Practice the conversation before the door opens",
    template: "%s · Driven2Develop",
  },
  description:
    "Driven2Develop helps door-to-door teams practice realistic conversations, understand exactly where trust is gained or lost, and turn every weakness into the next drill.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className="font-sans antialiased text-[15px]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
