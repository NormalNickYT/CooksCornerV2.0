import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../core/env";
import { BadRequestError } from "../core/errors";

/**
 * Recipe image uploads.
 *
 * Filenames are generated, never taken from the client: the previous version
 * stored files under `file.originalname`, so two people uploading `foto.jpg`
 * overwrote each other and a crafted name could escape the directory.
 */
export const UPLOAD_DIR = path.resolve(import.meta.dirname, "../../uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOAD_DIR),
  filename: (_req, file, callback) => {
    const extension = ALLOWED_MIME.get(file.mimetype) ?? ".bin";
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const uploadRecipeImage = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      callback(new BadRequestError("Alleen JPG, PNG, WebP, AVIF of GIF is toegestaan"));
      return;
    }
    callback(null, true);
  },
});

/** Best-effort cleanup, used when a request fails after the file landed. */
export async function removeUpload(filename: string | null | undefined): Promise<void> {
  if (!filename) return;
  // Guard against a stored value that somehow contains a path.
  const safe = path.basename(filename);
  await fs.promises.rm(path.join(UPLOAD_DIR, safe), { force: true }).catch(() => undefined);
}
