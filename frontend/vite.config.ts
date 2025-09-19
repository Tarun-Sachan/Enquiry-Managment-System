import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }: ConfigEnv) => {
  // Load .env variables based on mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_PORT) || 3000, // fallback to 3000
    },
  });
};
