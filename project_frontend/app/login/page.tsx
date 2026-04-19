"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showRegisteredMessage = useMemo(
    () => searchParams.get("registered") === "1",
    [searchParams],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof payload.message === "string"
            ? payload.message
            : "Login failed";
        setError(message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong while logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-gradient-card p-8 shadow-elevated">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your TECHKHOR account.
          </p>

          {showRegisteredMessage && (
            <p className="mt-4 rounded-xl border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-accent">
              Registration successful. Please login.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-gradient-brand text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/register" className="font-semibold text-accent">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
