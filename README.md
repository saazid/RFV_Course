# Right Form of Verbs — Masterclass Landing Page

A production-ready Next.js 14 landing page for the **Right Form of Verbs Masterclass** by **Saif Academy**. Mobile-first, deeply animated, and backed by a functional enrollment API with file upload.

- Course: **Right Form of Verbs (Masterclass)**
- Duration: **4 classes · 1h 20m each**
- Fee: **400 BDT**
- Offered by: **Saif Academy**

## Tech stack

| Layer       | Tool                                                         |
| ----------- | ------------------------------------------------------------ |
| Framework   | [Next.js 14](https://nextjs.org/) (App Router) · React 18    |
| Language    | TypeScript (strict)                                          |
| Styling     | Tailwind CSS 3 · custom design tokens & animations           |
| Animation   | [Framer Motion](https://www.framer.com/motion/) + CSS keyframes |
| Forms       | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev) |
| Icons       | [lucide-react](https://lucide.dev)                           |
| Backend API | Next.js Route Handlers (`/api/enroll`) — Node runtime        |
| Uploads     | Native `FormData` / `File` — no extra deps                   |

## Feature highlights

- Hyper-responsive, mobile-first layout (flawless from 320px upward)
- Fade-in scroll animations, floating shapes, micro-interactions
- Modern glassmorphism + gradient UI (Deep Navy / Electric Indigo / White)
- Fully functional enrollment form with validation, file upload, clear errors
- Serverless-friendly API with graceful `/tmp` fallback for Vercel/Netlify
- Accessible (semantic HTML, skip link, focus styles, reduced-motion support)
- SEO-ready (Open Graph, structured `Course` JSON-LD, sensible defaults)
- Security headers, strict CSP-friendly setup, no `powered-by` leak
- Lighthouse-optimized: self-hosted Google fonts, no images required, code-split
- Complete FAQ, payment steps, and WhatsApp integration

## Project structure

```
RFV_Course/
├── app/
│   ├── api/
│   │   └── enroll/
│   │       └── route.ts        # POST handler: validation + upload + storage
│   ├── globals.css             # Tailwind layers + custom tokens
│   ├── layout.tsx              # Fonts, metadata, viewport
│   ├── not-found.tsx           # 404 page
│   └── page.tsx                # Homepage (composes all sections)
├── components/
│   ├── About.tsx
│   ├── EnrollForm.tsx          # react-hook-form client form
│   ├── EnrollSection.tsx
│   ├── FAQ.tsx
│   ├── Features.tsx
│   ├── FloatingShapes.tsx      # Framer Motion floating graphics
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Outline.tsx             # 4-class syllabus timeline
│   └── Payment.tsx             # bKash / Nagad / Rocket cards
├── lib/
│   ├── animations.ts           # Reusable Framer Motion variants
│   ├── constants.ts            # Course + contact + syllabus data
│   ├── notify.ts               # Optional SMTP admin notifier
│   ├── storage.ts              # File + JSONL persistence (Vercel-safe)
│   └── validation.ts           # Zod schema + file rules
├── public/
│   └── favicon.svg
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Local development

**Requirements:** Node.js 18.17+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your numbers
cp .env.local.example .env.local

# 3. Run the dev server
npm run dev
# → http://localhost:3000
```

### Useful scripts

```bash
npm run dev         # start dev server
npm run build       # production build
npm run start       # run the production build
npm run lint        # ESLint
npm run typecheck   # TS type-check only
```

## Environment variables

Only the payment numbers are strictly required for display. Everything else is optional.

| Variable                       | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `NEXT_PUBLIC_BKASH_NUMBER`     | Number shown in the bKash payment card               |
| `NEXT_PUBLIC_NAGAD_NUMBER`     | Number shown in the Nagad payment card               |
| `NEXT_PUBLIC_ROCKET_NUMBER`    | Number shown in the Rocket payment card              |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | WhatsApp number shown in footer/CTA                  |
| `NEXT_PUBLIC_FACEBOOK_URL`     | Facebook page URL                                    |
| `SMTP_HOST` / `SMTP_PORT`      | Optional SMTP server for admin emails                |
| `SMTP_USER` / `SMTP_PASS`      | SMTP credentials                                     |
| `SMTP_FROM` / `ADMIN_EMAIL`    | From/To addresses for admin notifications            |

If SMTP variables are omitted, the API still works — submissions are appended to a JSONL file (`data/submissions.jsonl` locally, `/tmp/rfv-data/submissions.jsonl` on serverless platforms).

## API contract

### `POST /api/enroll`

Accepts `multipart/form-data`:

| Field            | Type     | Rules                                      |
| ---------------- | -------- | ------------------------------------------ |
| `fullName`       | string   | 3–80 chars                                 |
| `phone`          | string   | Bangladeshi mobile (`01XXXXXXXXX`, +880 OK)|
| `paymentMethod`  | string   | `bkash`, `nagad`, or `rocket`              |
| `transactionId`  | string   | 6–40 alphanumeric                          |
| `screenshot`     | File     | JPG/PNG/WEBP/HEIC, ≤ 5 MB                  |

**Responses**

```http
201 Created
{ "ok": true, "id": "…", "message": "Enrollment received…" }
```

```http
400 Bad Request
{ "ok": false, "error": "Validation failed", "fieldErrors": { … } }
```

## Push to GitHub

Replace `<your-username>` with your actual GitHub username.

```bash
# Initialize (skip if already done)
git init
git branch -M main

# Stage and commit
git add .
git commit -m "feat: right form of verbs masterclass landing page"

# Link remote and push
git remote add origin https://github.com/<your-username>/rfv-course.git
git push -u origin main
```

## Deploy to Vercel (recommended)

1. Push the repo to GitHub (see above).
2. Visit [vercel.com/new](https://vercel.com/new) and import your repo.
3. Framework preset will auto-detect as **Next.js** — leave defaults.
4. Add the environment variables from `.env.local.example` in the Vercel dashboard.
5. Click **Deploy**. That's it.

Notes for Vercel:

- The `app/api/enroll/route.ts` runs on the Node.js runtime and writes uploads to `/tmp` (Vercel-safe).
- For persistent storage, swap the body of `lib/storage.ts` for an S3/R2/Cloudinary upload — the API shape stays the same.

## Deploy to Netlify

1. Push the repo to GitHub.
2. In Netlify, **Add new site → Import from Git** and pick the repo.
3. Build command: `npm run build` · Publish directory: `.next`.
4. Install the **Next.js Runtime** plugin when prompted (Netlify does this automatically for Next sites).
5. Add the environment variables from `.env.local.example`.
6. Click **Deploy site**.

## Swap in real email / database

- **Email notifications:** uncomment the Nodemailer block in `lib/notify.ts` and `npm i nodemailer @types/nodemailer`. Set the `SMTP_*` env vars.
- **Database:** replace the body of `persistSubmission` in `lib/storage.ts` with a call to Supabase, Neon, Firebase, or your DB of choice.
- **Object storage:** for screenshots, upload the `fileBuffer` to S3/R2/Cloudinary and store the returned URL in `storedPath`.

## License

Proprietary — © Saif Academy. All rights reserved.
