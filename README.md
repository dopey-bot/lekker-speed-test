# Lekker Speed Test

South Africa's internet speed test — with local humour. Measures download, upload and ping against Cloudflare's edge network (including Johannesburg and Cape Town) and pairs the result with a random SA slogan you can share.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **`@cloudflare/speedtest`** — no backend required for measurement
- **Supabase** — Postgres for slogans / suggestions / ads, Storage for banners, Auth for `/admin`
- **`react-helmet-async`** — per-route meta tags
- **`@vercel/og`** — dynamic Open Graph images for `/result/:id`
- **Vercel** — recommended host

---

## Quick start (for a newbie, step by step)

You'll need:
- **Node.js 18+** installed ([download](https://nodejs.org))
- A free **Supabase** account ([supabase.com](https://supabase.com))
- A free **Vercel** account ([vercel.com](https://vercel.com))
- A **GitHub** account with the `lekker-speed-test` repo already created (which you did!)

### 1. Put the code in your repo

From the folder containing this README, run:

\`\`\`bash
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin https://github.com/dopey-bot/lekker-speed-test.git
git push -u origin main
\`\`\`

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com). Pick a strong DB password — save it.
2. Wait for it to finish provisioning (~2 minutes).
3. In the sidebar: **SQL Editor** → **New query** → paste the contents of `supabase/migrations/001_initial_schema.sql` → **Run**. You should see "Success. No rows returned."
4. New query again → paste `supabase/seed.sql` → **Run**. This seeds ~40 starter slogans.
5. Sidebar → **Settings → API** → copy:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public key** (under "Project API keys")

### 3. Create the admin user

1. Supabase sidebar → **Authentication → Users** → **Add user → Create new user**.
2. Enter your email and a strong password. Tick **Auto Confirm User**. Click create.
3. That's the user that will sign in at `/admin` on your site.

### 4. Run it locally

\`\`\`bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL + anon key, then:
npm run dev
\`\`\`

Open [http://localhost:8080](http://localhost:8080).

### 5. Deploy to Vercel

1. Push your code to GitHub (step 1).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import `lekker-speed-test`.
3. Vercel auto-detects Vite — leave defaults.
4. Under **Environment Variables**, add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`.
5. **Deploy**.

### 6. Custom domain (optional)

Vercel → Settings → Domains → add your domain. Update `VITE_SITE_URL` and redeploy.

---

## Scripts

\`\`\`bash
npm run dev        # dev server on :8080
npm run build      # production build
npm run preview    # preview the production build locally
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
\`\`\`

---

## SEO

- `react-helmet-async` for per-route meta tags
- `index.html` ships default social tags
- `public/robots.txt` + `public/sitemap.xml`
- JSON-LD `WebApplication` schema on the home page
- Dynamic OG images via `/api/og` (Vercel Edge Function)

### Known SPA limitation
Result page body text is only rendered after JS runs — fine for Google, less great for some social crawlers. The `/api/og` Edge Function ships proper preview images regardless. Migrate to Next.js later if you need full SSR.

---

## Security

- RLS on every Supabase table
- DOMPurify on user-submitted strings
- Honeypot fields + length limits on forms
- No PII stored
- Security headers in `vercel.json`

---

## Not built yet (v2 roadmap)

- Admin UI for suggestions / ads / enquiries (manage in Supabase for now)
- Ad banner upload UI (upload to Storage manually for now)
- Real-time rugby event mode
- AdSense integration
- Regular-user accounts

---

## Credits

Built on Cloudflare's speed test infrastructure. Slogans need review by native speakers before shipping widely.