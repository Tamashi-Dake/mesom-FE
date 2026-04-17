import { QueryClient, MutationCache } from "@tanstack/react-query";
import toast from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
  // Global fallback: show a toast for any mutation that doesn't define its own onError.
  // Mutations with their own onError handler take precedence (no duplicate toasts).
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.options.onError) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(message);
      }
    },
  }),
});

export default queryClient;
