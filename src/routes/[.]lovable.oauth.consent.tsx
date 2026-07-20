import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

// Typed shim for the beta supabase.auth.oauth namespace.
type OAuthResult = {
  data?: { client?: { name?: string; redirect_uri?: string }; redirect_url?: string; redirect_to?: string; scope?: string };
  error?: { message: string } | null;
};
type OAuthAPI = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
function oauthApi(): OAuthAPI {
  return (supabase.auth as unknown as { oauth: OAuthAPI }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="container-page py-12 max-w-md">
      <div className="card-surface p-6">
        <h1 className="text-xl font-black">Authorization error</h1>
        <p className="mt-2 text-sm text-mid">
          {String((error as Error)?.message ?? error)}
        </p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <main className="container-page py-12 max-w-lg">
      <div className="card-surface p-6 md:p-8">
        <h1 className="text-2xl font-black">Connect {clientName} to {SITE.shortName}</h1>
        <p className="mt-2 text-sm text-mid">
          {clientName} will be able to call this app's enabled tools while you are signed in.
          Admin-only actions (creating, editing, or deleting products) remain restricted by your
          account's permissions.
        </p>
        {details?.client?.redirect_uri && (
          <p className="mt-4 text-xs text-mid break-all">
            Redirect: <span className="font-mono">{details.client.redirect_uri}</span>
          </p>
        )}
        {error && (
          <div className="mt-4 text-sm font-bold text-brand bg-brand/10 border border-brand/30 rounded-md p-3" role="alert">
            {error}
          </div>
        )}
        <div className="mt-6 flex gap-2">
          <button disabled={busy} onClick={() => decide(true)} className="btn-brand">
            {busy ? "Please wait…" : "Approve"}
          </button>
          <button disabled={busy} onClick={() => decide(false)} className="btn-outline-charcoal">
            Cancel connection
          </button>
        </div>
      </div>
    </main>
  );
}
