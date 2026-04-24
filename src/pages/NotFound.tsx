import { useEffect, useState } from "react";
import { supabase, hasSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { LANGUAGES, type Slogan } from "@/types/database";
import { sanitizeText, validSlogan, validEmail } from "@/lib/sanitize";
import { toast } from "sonner";

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hasSupabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <div className="container py-20 text-center">Checking auth…</div>;
  }

  if (!hasSupabase) {
    return (
      <div className="container py-20 max-w-lg mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Admin unavailable</h1>
        <p className="text-muted-foreground">
          Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and{" "}
          <code>VITE_SUPABASE_ANON_KEY</code> in your environment.
        </p>
      </div>
    );
  }

  if (!session) return <LoginForm />;
  return <AdminDashboard onSignOut={() => supabase.auth.signOut()} />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validEmail(email) || !password) {
      toast.error("Enter email and password.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) toast.error(error.message);
  }

  return (
    <>
      <SEO title="Admin — Lekker Speed Test" description="Admin area." noindex path="/admin" />
      <div className="container py-20 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin sign in</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </>
  );
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [slogans, setSlogans] = useState<Slogan[]>([]);
  const [loading, setLoading] = useState(true);

  const [newText, setNewText] = useState("");
  const [newLang, setNewLang] = useState("en");
  const [newMin, setNewMin] = useState(0);
  const [newMax, setNewMax] = useState(100);

  async function refresh() {
    setLoading(true);
    const { data } = await supabase
      .from("slogans")
      .select("*")
      .order("created_at", { ascending: false });
    setSlogans((data as Slogan[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addSlogan(e: React.FormEvent) {
    e.preventDefault();
    if (!validSlogan(newText)) {
      toast.error("Slogan must be 1–200 characters.");
      return;
    }
    const { error } = await supabase.from("slogans").insert({
      text: sanitizeText(newText),
      language: newLang,
      speed_bucket_min_mbps: newMin,
      speed_bucket_max_mbps: newMax,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewText("");
    toast.success("Slogan added.");
    refresh();
  }

  async function toggleActive(s: Slogan) {
    await supabase
      .from("slogans")
      .update({ active: !s.active })
      .eq("id", s.id);
    refresh();
  }

  async function remove(s: Slogan) {
    if (!confirm(`Delete slogan "${s.text.slice(0, 40)}…"?`)) return;
    await supabase.from("slogans").delete().eq("id", s.id);
    refresh();
  }

  return (
    <>
      <SEO title="Admin — Lekker Speed Test" description="Admin area." noindex path="/admin" />
      <div className="container py-10 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin</h1>
          <Button variant="outline" onClick={onSignOut}>
            Sign out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add a slogan</CardTitle>
            <CardDescription>Saved directly to the live DB.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addSlogan} className="space-y-4">
              <Textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Slogan text"
                maxLength={200}
                required
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Min Mbps</Label>
                  <Input
                    type="number"
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Mbps</Label>
                  <Input
                    type="number"
                    value={newMax}
                    onChange={(e) => setNewMax(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              <Button type="submit">Add slogan</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Slogans ({slogans.length})</h2>
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {!loading && slogans.length === 0 && (
            <p className="text-muted-foreground">No slogans yet.</p>
          )}
          <ul className="space-y-2">
            {slogans.map((s) => (
              <li
                key={s.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className={s.active ? "" : "line-through opacity-60"}>{s.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.language.toUpperCase()} · {s.speed_bucket_min_mbps}–
                    {s.speed_bucket_max_mbps} Mbps · {s.topic ?? "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(s)}>
                    {s.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(s)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Suggestions, ads, and enquiries management — coming soon. For now, manage
          those directly in the Supabase dashboard.
        </p>
      </div>
    </>
  );
}