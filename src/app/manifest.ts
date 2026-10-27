import type { MetadataRoute } from "next";

// Lets visitors "Add to Home Screen" and open the site full-screen like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LawPrep Tutorial Noida",
    short_name: "LPT Noida",
    description: "CLAT & AILET coaching at LawPrep Tutorial's Noida centre.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
