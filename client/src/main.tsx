import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import superjson from "superjson";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { trpc } from "./lib/trpc";

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${window.location.origin}/api/trpc`,
          transformer: superjson,
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider switchable={true}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const rootEl =
  document.getElementById("root") ||
  document.body.appendChild(document.createElement("div"));
rootEl.id = "root";
createRoot(rootEl).render(<Root />);
