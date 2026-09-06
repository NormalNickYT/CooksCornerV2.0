import path from "node:path";
import react from "@vitejs/plugin-react";
// vitest/config re-exports Vite's defineConfig with the `test` key added.
import { defineConfig } from "vitest/config";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            // Same-origin in development, so session cookies just work and there is
            // no CORS preflight on every request.
            "/api": { target: "http://localhost:5000", changeOrigin: true },
            "/uploads": { target: "http://localhost:5000", changeOrigin: true },
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
    },
});
