/**
 * A local PostgreSQL server without Docker.
 *
 * Docker Desktop needs WSL2, which needs a reboot to install. This runs the
 * real PostgreSQL binaries from an npm package instead, on the same port and
 * with the same credentials as docker-compose.yml, so .env works either way
 * and nothing in the app can tell the difference.
 *
 *   npm run db:local     start it (keeps running until you stop it)
 */
import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const DATA_DIR = path.resolve(import.meta.dirname, "../.pgdata");
const PORT = 5433;

async function main(): Promise<void> {
  const alreadyInitialised = fs.existsSync(path.join(DATA_DIR, "PG_VERSION"));

  const postgres = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "cookscorner",
    password: "cookscorner",
    port: PORT,
    persistent: true,
  });

  if (!alreadyInitialised) {
    console.log("Initialising a fresh PostgreSQL cluster...");
    await postgres.initialise();
  }

  await postgres.start();
  console.log(`PostgreSQL listening on localhost:${PORT}`);

  try {
    await postgres.createDatabase("cookscorner");
    console.log("Created database 'cookscorner'");
  } catch {
    // Already there from a previous run.
  }

  console.log("Ready. Press Ctrl+C to stop.");

  const stop = async () => {
    console.log("\nStopping PostgreSQL...");
    await postgres.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch((error) => {
  console.error("Could not start the local database:", error);
  process.exit(1);
});
