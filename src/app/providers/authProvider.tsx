import { createContext, useContext, useMemo, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { refreshSession } from "../../modules/auth/api";

interface AuthContextValue {
  currentUser: unknown;
  isLoadingCurrentUser: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const currentUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const data = await refreshSession();
      return data.user ?? data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const value = useMemo(
    () => ({
      currentUser: currentUserQuery?.data,
      isLoadingCurrentUser: currentUserQuery.isLoading,
    }),
    [currentUserQuery.isLoading, currentUserQuery.data],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useCurrentUser() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error(
      "useCurrentUser must be used within an AuthContextProvider",
    );

  return context;
}
