import { supabase } from "@/integrations/supabase/client";

/**
 * Admin sessions must not survive a page load: every fresh load of the app
 * clears any stored Supabase session so nobody can reach product editing by
 * reopening the browser / refreshing on a shared device.
 *
 * Module scope means this runs at most once per page load; client navigations
 * within the SPA keep the session the admin just created.
 */
let resetPromise: Promise<void> | null = null;

export function resetSessionOnPageLoad(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!resetPromise) {
    resetPromise = supabase.auth
      .signOut({ scope: "local" })
      .then(() => undefined)
      .catch(() => undefined);
  }
  return resetPromise;
}
