import { useEffect, createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// import useCurrentUserStore from "../../hooks/useCurrentUserStore";
import { getCurrentUser } from "../../services/authService";
import { useSocket } from "../../hooks/useSocket";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  //   const { currentUser, setCurrentUser } = useCurrentUserStore();
  const currentUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
  });

  //   useEffect(() => {
  //     if (currentUserQuery.data) {
  //       setCurrentUser(currentUserQuery.data);
  //     }
  //   }, [currentUserQuery.data]);

  const socket = useSocket(currentUserQuery.data);

  const value = useMemo(
    () => ({
      currentUser: currentUserQuery?.data,
      isLoadingCurrentUser: currentUserQuery.isLoading,
      socket,
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
