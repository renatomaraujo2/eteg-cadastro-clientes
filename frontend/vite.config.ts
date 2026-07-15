import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Em desenvolvimento, encaminha as chamadas /api para o backend,
    // evitando problemas de CORS e mantendo as URLs relativas.
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
