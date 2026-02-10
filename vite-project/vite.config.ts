import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

// Get Vercel environment
const isVercel = !!process.env.VERCEL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    base: process.env.VITE_SECRET_KEY || "/NetWorkingGrup/",
  },
  build: {
    // Do not generate source maps in production
    sourcemap: false,
    // Use terser to remove console/debugger and strip comments
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
});
