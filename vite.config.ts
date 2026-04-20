import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed on a custom domain (thisisait.eu) so base stays at "/".
// If you ever deploy to username.github.io/repo/, set base to "/repo/".
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
