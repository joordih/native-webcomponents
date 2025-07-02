import franken from "franken-ui/plugin-vite";
import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["assets/franken-ui.css"],
  base: "/",
  plugins: [
    franken({
      preflight: true,
    }),
  ],
  server: {
    port: 3000,
  },
});
