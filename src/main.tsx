import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorPage } from "./components/errors/error-page";
import { NotFoundPage } from "./components/errors/not-found-page";
import { setupNative } from "./lib/native";
import { setupShortcuts } from "./lib/shortcuts";
import { routeTree } from "./routeTree.gen";
import "./styles.css";

// hide the webview's default menu (Reload, Inspect) outside of text fields
if (import.meta.env.PROD) {
  document.addEventListener("contextmenu", (event) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
      event.preventDefault();
    }
  });
}

setupShortcuts();
setupNative();

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60_000 } } });

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultStaleTime: 60_000,
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
  scrollRestoration: true,
  scrollToTopSelectors: ["#content"],
  defaultErrorComponent: ErrorPage,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
