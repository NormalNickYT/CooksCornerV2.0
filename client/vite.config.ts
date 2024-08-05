import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import dotenv from "dotenv";

dotenv.config(); // load env vars from .env

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          secure: false,
          changeOrigin: true,
        },
        "/uploads": {
          target: "http://localhost:5000",
          secure: false,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __SERVER_URL__: `"${process.env.SERVER_URL_DEV}"`,
    },
  });
};
