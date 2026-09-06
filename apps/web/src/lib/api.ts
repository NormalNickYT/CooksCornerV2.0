import axios, { AxiosError } from "axios";

/**
 * The HTTP client for the whole app.
 *
 * Relative baseURL so Vite's proxy handles it in development and the same
 * build works in production behind one origin. `withCredentials` matters:
 * without it the browser drops the session cookie.
 */
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Array<{ path: string; message: string }> | unknown;
  };
}

/**
 * Pulls the human-readable message out of an API error.
 *
 * The server answers with a consistent `{ error: { code, message } }` shape,
 * so the UI never has to render "Request failed with status code 409".
 */
export function errorMessage(error: unknown, fallback = "Er ging iets mis"): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.error?.message) return body.error.message;
    if (error.code === "ERR_NETWORK") return "Geen verbinding met de server";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Field-level validation errors, keyed by form field name. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof AxiosError)) return {};
  const details = (error.response?.data as ApiErrorBody | undefined)?.error?.details;
  if (!Array.isArray(details)) return {};

  const result: Record<string, string> = {};
  for (const detail of details) {
    if (detail && typeof detail === "object" && "path" in detail && "message" in detail) {
      result[String(detail.path)] = String(detail.message);
    }
  }
  return result;
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401;
}
