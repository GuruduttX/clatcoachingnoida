import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CLAT Coaching in Noida | LawPrep Tutorial",
    template: "%s | CLAT Coaching Noida · LawPrep Tutorial",
  },
  description:
    "The Noida centre of LawPrep Tutorial. Classroom and online CLAT & AILET coaching for Class 11, Class 12 and repeat aspirants.",
  appleWebApp: { capable: true, title: "LPT Noida", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${hanken.variable} ${bricolage.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
