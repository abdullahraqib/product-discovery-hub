import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Admin Sign In — ${SITE.shortName}` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page py-12 max-w-md">
      <div className="card-surface p-6 md:p-8">
        <h1 className="text-2xl font-black">{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
        <p className="text-sm text-mid mt-1">
          {mode === "signin"
            ? "Sign in to manage products."
            : "The first account created automatically becomes the admin."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-mid block mb-1">Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-bold border-2 border-border rounded-md focus:border-brand outline-none bg-white"
            />
          </label>

          {error && (
            <div className="text-sm font-bold text-brand bg-brand/10 border border-brand/30 rounded-md p-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-brand w-full justify-center">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-mid hover:text-brand font-bold w-full text-center"
        >
          {mode === "signin" ? "Need to create an admin account?" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
