import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["calculator-favicon.svg", "robots.txt", "sitemap.xml"],
      manifest: {
        name: "Calculadora de impuestos en Colombia | TaxFlow 2026",
        short_name: "Impuestos CO",
        description:
          "Calcula 4x1000, retención en la fuente, IVA y aportes con simuladores tributarios para Colombia.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#0f172a",
        icons: [
          {
            src: "/pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,png,json}"],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
