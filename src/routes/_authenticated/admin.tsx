import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${SITE.shortName}` },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      setAllowed(Boolean(data));
      setChecking(false);
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return <div className="container-page py-20 text-center text-mid">Checking access…</div>;
  }

  if (!allowed) {
    return (
      <div className="container-page py-20 max-w-md text-center">
        <h1 className="text-2xl font-black">Not an admin</h1>
        <p className="text-mid mt-2">
          Your account does not have admin access. Ask an existing admin to grant you the role.
        </p>
        <button onClick={signOut} className="btn-outline-charcoal mt-6">Sign out</button>
      </div>
    );
  }

  return (
    <div className="container-page py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Product admin</h1>
          <p className="text-sm text-mid">Add, edit and remove products in the catalogue.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin" className="btn-outline-charcoal text-sm">All products</Link>
          <Link to="/admin/new" className="btn-brand text-sm">+ New product</Link>
          <button onClick={signOut} className="text-sm font-bold text-mid hover:text-brand px-3">
            Sign out
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
