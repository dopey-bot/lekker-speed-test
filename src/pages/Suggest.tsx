import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { supabase, hasSupabase } from "@/lib/supabase";
import { LANGUAGES } from "@/types/database";
import { sanitizeText, validSlogan } from "@/lib/sanitize";
import { toast } from "sonner";

export default function Suggest() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [topic, setTopic] = useState("");
  const [bucket, setBucket] = useState("lekker");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!validSlogan(text)) {
      toast.error("Slogan must be 1–200 characters.");
      return;
    }
    if (!hasSupabase) {
      toast.error("Submissions are offline. Set up Supabase first.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("slogan_suggestions").insert({
      text: sanitizeText(text),
      language,
      topic: topic ? sanitizeText(topic) : null,
      suggested_bucket: bucket,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Try again.");
      return;
    }
    toast.success("Thanks! Your slogan is in the review queue.");
    setText("");
    setTopic("");
  }

  return (
    <>
      <SEO
        title="Suggest a Slogan — Lekker Speed Test"
        description="Have a funny South African slogan idea for Lekker Speed Test? Send it to us — we'll review it and, if it's lekker, add it to the app."
        path="/suggest"
      />
      <div className="container py-10 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2">Suggest a slogan</h1>
        <p className="text-muted-foreground mb-8">
          Got a funny one? Drop it below. We review everything before it goes live.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute left-[-9999px]"
            aria-hidden="true"
          />

          <div className="space-y-2">
            <Label htmlFor="text">Slogan *</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='e.g. "Faster than a taxi on the shoulder of the N2."'
              maxLength={200}
              required
            />
            <p className="text-xs text-muted-foreground">
              {text.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic (optional)</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. braai, rugby, potholes"
              maxLength={60}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket">Best matches which speed?</Label>
            <Select value={bucket} onValueChange={setBucket}>
              <SelectTrigger id="bucket">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="painful">Painful (0–5 Mbps)</SelectItem>
                <SelectItem value="okay">Okay (5–25 Mbps)</SelectItem>
                <SelectItem value="lekker">Lekker (25–100 Mbps)</SelectItem>
                <SelectItem value="fast">Fast (100–500 Mbps)</SelectItem>
                <SelectItem value="ferrari">Ferrari (500+ Mbps)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={submitting} size="lg" className="w-full">
            {submitting ? "Submitting…" : "Submit slogan"}
          </Button>
        </form>
      </div>
    </>
  );
}