import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// The HTML entry intentionally uses the same Babel preview runtime in production.
// Preserve its fetched sources, which Vite cannot discover through classic scripts.
const previewRuntime = {
  name: "landing-preview-runtime",
  apply: "build",
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "robots.txt", source: "User-agent: *\nAllow: /\n" });
    for (const fileName of ["js/lp-boot.js", "js/landing-loader.js", "src/lp_nataleluia_landing_page.jsx", "src/BorderGlow.jsx", "src/AccessibilityWidget.jsx"]) {
      this.emitFile({ type: "asset", fileName, source: readFileSync(new URL(fileName, import.meta.url), "utf8") });
    }
  },
  closeBundle() {
    cpSync(new URL("./assets", import.meta.url), new URL("./dist/assets", import.meta.url), {
      recursive: true,
      filter: (source) => statSync(source).isDirectory() || /\.(png|jpe?g|webp|gif|svg|ico|avif|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf)$/i.test(path.extname(source)),
    });
  },
};

export default defineConfig({
  base: "./",
  // Only the curated assets above belong in the upload; public/ contains legacy mirrors.
  publicDir: false,
  plugins: [react(), previewRuntime],
});
