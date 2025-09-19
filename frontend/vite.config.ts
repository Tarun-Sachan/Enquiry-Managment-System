import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Load .env file based on mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 3000,
    },
  });
};
