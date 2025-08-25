import { QueryClient } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from "../../../server/src/server";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});
