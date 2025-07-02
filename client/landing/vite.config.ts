import { defineConfig } from "vite";
import * as path from "path";
import fs from "fs";

export default defineConfig({
  assetsInclude: ["assets/root.css", "**/*/*.ttf"],
  base: "/landing",
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@redux": path.resolve(__dirname, "./src/redux"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
  preview: {
    https: {
      key: fs.readFileSync('joordih.gov-key.pem'),
      cert: fs.readFileSync('joordih.gov.pem')
    },
    host: 'joordih.gov',
    port: 443,
  },
  server: {
    https: {
      key: fs.readFileSync('joordih.gov-key.pem'),
      cert: fs.readFileSync('joordih.gov.pem')
    },
    host: 'joordih.gov',
    port: 443,
  }
});
