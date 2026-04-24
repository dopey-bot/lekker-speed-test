import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { supabase, hasSupabase } from "@/lib/supabase";
import { sanitizeText, validMessage, validEmail } from "@/lib/sanitize";
import { toast } from "sonner";

export default function Advertise() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!name.trim() || !validEmail(email) || !validMessage(message)) {
      toast.error("Please fill in name, a valid email, and a message.");
      return;
    }
    if (!hasSupabase) {
      toast.error("Contact form is offline. Set up Supabase first.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("advertiser_enquiries").insert({
      name: sanitizeText(name),
      email: email.trim(),
      company: company ? sanitizeText(company) : null,
      message: sanitizeText(message),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Try again.");
      return;
    }
    toast.success("Thanks — we'll be in touch.");
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
  }

  return (
    <>
      <SEO
        title="Advertise on Lekker Speed Test"
        description="Reach South Africans while they're checking their internet speed. Lekker Speed Test offers sticky banner placements on desktop and mobile."
        path="/advertise"
      />
      <div className="container py-10 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2">Advertise with us</h1>
        <p className="text-muted-foreground mb-8">
          Lekker Speed Test reaches South Africans at a moment of real attention — while
          they're checking their connection. Get in touch about banner placements.
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
            <Label htmlFor="name">Your name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your campaign."
              required
              maxLength={2000}
            />
          </div>

          <Button type="submit" disabled={submitting} size="lg" className="w-full">
            {submitting ? "Sending…" : "Send enquiry"}
          </Button>
        </form>
      </div>
    </>
  );
}