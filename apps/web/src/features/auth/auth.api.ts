import type { LoginInput, PublicUser, RegisterInput } from "@cookscorner/shared";
import { api } from "@/lib/api";

export interface AuthProviders {
  password: boolean;
  google: boolean;
}

export const authApi = {
  async me(): Promise<PublicUser> {
    const { data } = await api.get<PublicUser>("/auth/me");
    return data;
  },

  async login(input: LoginInput): Promise<PublicUser> {
    const { data } = await api.post<PublicUser>("/auth/login", input);
    return data;
  },

  async register(input: RegisterInput): Promise<PublicUser> {
    const { data } = await api.post<PublicUser>("/auth/register", input);
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  /** Lets the sign-in page hide the Google button when it is not configured. */
  async providers(): Promise<AuthProviders> {
    const { data } = await api.get<AuthProviders>("/auth/providers");
    return data;
  },
};

/** Full page navigation: OAuth cannot happen inside an XHR. */
export function startGoogleLogin(): void {
  window.location.href = "/api/auth/google";
}
