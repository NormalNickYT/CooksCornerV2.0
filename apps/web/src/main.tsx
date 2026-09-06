import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { isUnauthorized } from "./lib/api";
import "./index.css";

/**
 * One query client for the app.
 *
 * A 401 is a legitimate answer ("nobody is signed in"), so it is never
 * retried: doing so delays every anonymous page load by three round trips.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster richColors closeButton position="bottom-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
