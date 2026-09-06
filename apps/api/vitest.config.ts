import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration tests share one database, so they run in a single file at a
    // time rather than racing each other over the same rows.
    fileParallelism: false,
    env: {
      // Silences the request logger and keeps bcrypt rounds honest.
      NODE_ENV: "test",
    },
  },
});
