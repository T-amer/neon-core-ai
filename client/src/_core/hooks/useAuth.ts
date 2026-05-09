import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};

  const logout = useCallback(async () => {
    localStorage.removeItem("manus-runtime-user-info");
  }, []);

  const state = useMemo(() => {
    const stored = localStorage.getItem("manus-runtime-user-info");
    const user = stored ? JSON.parse(stored) : null;
    return {
      user,
      loading: false,
      error: null,
      isAuthenticated: Boolean(user),
    };
  }, []);

  return {
    ...state,
    refresh: () => Promise.resolve(),
    logout,
  };
}
