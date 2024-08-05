import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error.status === 401) return false;
                return failureCount < 1;
            },
            refetchOnWindowFocus: false,
        },
    },
});

export default queryClient;