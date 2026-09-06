import type { LoginInput, PublicUser, RegisterInput } from "@cookscorner/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isUnauthorized } from "@/lib/api";
import { authApi } from "./auth.api";

const ME_KEY = ["auth", "me"] as const;

/**
 * The signed-in user.
 *
 * A 401 is a normal answer here, not a failure: it means "nobody is signed
 * in". Retrying it would delay every anonymous page load.
 */
export function useCurrentUser() {
  const query = useQuery({
    queryKey: ME_KEY,
    queryFn: authApi.me,
    retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 2,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useProviders() {
  return useQuery({
    queryKey: ["auth", "providers"],
    queryFn: authApi.providers,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (user: PublicUser) => {
      queryClient.setQueryData(ME_KEY, user);
      // Recipe lists differ once signed in: drafts and ownership appear.
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (user: PublicUser) => queryClient.setQueryData(ME_KEY, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear everything: cached recipe lists may contain the user's drafts.
      queryClient.clear();
      queryClient.setQueryData(ME_KEY, null);
    },
  });
}
