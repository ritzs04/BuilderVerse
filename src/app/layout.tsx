import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BuilderVerse — Learn. Think. Build.",
    template: "%s · BuilderVerse",
  },
  description:
    "BuilderVerse is a supportive learning platform that takes students from watching tutorials to actually building projects: structured lessons, thinking puzzles, debugging practice, guided projects and gamified progress.",
};

/**
 * Applies the saved theme before React hydrates so there is no flash of the
 * wrong colour scheme. Kept tiny and dependency-free on purpose.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("bv-theme");var dark=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
