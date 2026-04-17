import { ReactNode } from "react";
import { AuthContextProvider } from "./authProvider";
import { SocketProvider } from "./socketProvider";
import { ThemeContextProvider } from "./themeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  );
}

export { useCurrentUser } from "./authProvider";
export { useSocket } from "./socketProvider";
export { useTheme } from "./themeProvider";
export { AuthContextProvider } from "./authProvider";
export { SocketProvider } from "./socketProvider";
export { ThemeContextProvider } from "./themeProvider";
