import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  base: "/admin", // o "/admin-refactor" según cómo lo sirvas
  assetsInclude: ["**/icons/*.svg", "assets/*.css", "**/*.html?inline"],
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@redux": path.resolve(__dirname, "./src/redux/"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  preview: {
    port: 5550,
  },
});
