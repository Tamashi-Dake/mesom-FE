import { useEffect, createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// import useCurrentUserStore from "../../hooks/useCurrentUserStore";
import { getCurrentUser } from "../../services/authService";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const currentUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
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
