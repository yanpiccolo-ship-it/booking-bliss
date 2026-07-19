import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type AuthorizationDetails = {
  client?: { name?: string; client_uri?: string; redirect_uris?: string[] } | null;
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

// Beta helpers on supabase.auth.oauth — narrow typing locally.
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
    approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
    denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  };
}).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <h1 className="text-lg font-semibold mb-2 text-foreground">Authorization error</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const clientName = details.client?.name ?? "an app";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Connect {clientName} to FlowBooking
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This lets {clientName} use FlowBooking as you. It can call the app's enabled
          tools while you are signed in. This does not bypass FlowBooking's permissions
          or backend policies.
        </p>
        {details.scope && (
          <p className="text-xs text-muted-foreground mb-6">
            Requested scope: <code>{details.scope}</code>
          </p>
        )}
        <div className="flex gap-3">
          <Button
            onClick={() => decide(true)}
            disabled={busy}
            className="flex-1 h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
          </Button>
          <Button
            onClick={() => decide(false)}
            disabled={busy}
            variant="outline"
            className="flex-1 h-11 rounded-xl"
          >
            Cancel connection
          </Button>
        </div>
      </div>
    </main>
  );
}
