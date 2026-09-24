import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The SPA asks for "/api/..." on its own origin, which is true once the Worker
// serves it. `npm run dev` has no Worker behind it, so send those calls on to
// the deployed one — the catalog and its photos then load locally exactly as
// they do in production, without a cross-origin request the Worker would have
// to grow CORS headers for.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://bakesbymom.snehagupta.workers.dev",
        changeOrigin: true,
      },
    },
  },
});
