"use client";
import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

const QueryLayout = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={new QueryClient()}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryLayout;
