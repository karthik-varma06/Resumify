import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { usePuterStore } from "~/lib/puter";
import { useThemeStore } from "~/lib/theme";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    init();
  }, []);

  // Apply theme class on mount and changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <script src="https://js.puter.com/v2/"></script>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>{message}</h1>
      <p style={{ color: "var(--text-secondary)" }}>{details}</p>
      {stack && (
        <pre style={{ overflow: "auto", padding: "1rem", fontSize: "0.8rem" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
