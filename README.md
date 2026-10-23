# MlimaLMS

MlimaLMS is a learning platform for Kenya with two sides:

- **A course marketplace** (similar to Udemy or Skillshare). Experts in any field (technology, health and medicine, accounting, business, design, agriculture, law, languages, school subjects and more) create courses, upload lessons and publish them. Students browse, enroll and learn at their own pace while their progress is tracked.
- **CBC e-tutoring** for learners, parents and schools: live online classes, KPSEA revision, child progress reports and a school package, inspired by [Mwalimu Plus](https://www.mwalimuplus.com/).

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, `cacheComponents`), React 19, TypeScript |
| Styling | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (base-nova on Base UI), Lucide icons |
| Auth | [Better Auth](https://better-auth.com) with email and password, plus GitHub sign-in |
| Database | PostgreSQL on [Neon](https://neon.tech), accessed through [Prisma 7](https://www.prisma.io) |
| Storage | AWS S3 with presigned browser uploads (optional) |
| Validation | Zod v4, `@t3-oss/env-nextjs` for environment variables |

## Getting started

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io)
- A PostgreSQL database (a free Neon database works)
- Optionally, a GitHub OAuth app and an AWS S3 bucket

### Setup

```bash
pnpm install
cp .env.example .env          # then fill in the values
pnpm exec prisma migrate dev  # create the database tables
pnpm exec prisma generate     # generate the Prisma client
pnpm db:seed                  # optional: demo categories, instructors and courses
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret used to sign sessions |
| `BETTER_AUTH_URL` | Yes | Base URL of the app, e.g. `http://localhost:3000` |
| `AUTH_GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `AUTH_GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app client secret |
| `AWS_REGION` | No | S3 bucket region, e.g. `af-south-1` |
| `AWS_ACCESS_KEY_ID` | No | IAM access key for uploads |
| `AWS_SECRET_ACCESS_KEY` | No | IAM secret key for uploads |
| `AWS_S3_BUCKET` | No | Bucket name for videos and cover images |
| `AWS_S3_PUBLIC_URL` | No | CloudFront or custom domain in front of the bucket |

The GitHub OAuth callback URL is `<BETTER_AUTH_URL>/api/auth/callback/github`.

When the AWS variables are empty, file uploads are switched off and instructors paste YouTube, Vimeo or `.mp4` links instead. See [docs/s3-setup.md](docs/s3-setup.md) for the bucket, CORS and IAM setup.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |
| `pnpm db:seed` | Seed demo categories, instructors and courses |
| `pnpm exec prisma migrate dev` | Apply schema changes to the database |
| `pnpm exec prisma generate` | Regenerate the Prisma client (run after every migration) |
| `pnpm exec prisma studio` | Browse the database in the browser |

## Features

### Course marketplace

- **Explore** (`/explore`): search, filter by 12 fields and sort by popularity, newest or price.
- **Course page** (`/explore/[slug]`): overview, curriculum, free preview lessons, instructor bio and enrollment.
- **Course player** (`/learn/[slug]`): video or written lessons, a lesson list, previous and next buttons, mark as complete, and a progress bar.
- **My courses** (`/courses`): enrolled courses with progress, split into in progress and completed.
- **Teach** (`/teach`): landing page for new instructors.
- **Instructor dashboard** (`/instructor`): stats, course list with draft or published status, and the instructor profile (headline and bio).
- **Course builder** (`/instructor/courses/new`, `/instructor/courses/[id]`): course details, cover image, lessons with video upload or links, free previews, publish, unpublish and delete.

### Website and e-tutoring

- An animated landing page, plus pages for about us, product, online tuition, KPSEA revision, child report, School of Languages, schools (with a demo request form), downloads, pricing, support, FAQs, blog, terms and privacy.
- A learner and parent dashboard with live classes, revision, children, billing and profile pages.

### Accounts

- Sign up and log in with email and password or GitHub, at `/signup` and `/login`.
- The user's session shows in the navbar and the dashboard sidebar.
- `proxy.ts` sends signed-out visitors to `/login` and returns them to the page they asked for after they sign in.

## Project structure

```
app/
  (marketing)/        Public website, explore, course pages and teach page
  (auth)/             Login and signup
  (dashboard)/        Learner dashboard and instructor pages (sidebar layout)
  learn/[slug]/       Full-screen course player
  api/auth/[...all]/  Better Auth route handler
components/
  site/               Navbar, footer, hero and landing page sections
  courses/            Course cards, forms, lesson manager, upload field and player
  dashboard/          Sidebar, header and dashboard widgets
  ui/                 shadcn/ui components
lib/
  actions/            Server actions (courses, enrollment, progress, uploads)
  queries/            Database queries for courses
  auth.ts             Better Auth server config
  s3.ts               S3 client, presigned uploads and cleanup
  env.ts              Typed environment variables
prisma/
  schema.prisma       Users, sessions, categories, courses, lessons, enrollments and progress
  seed.ts             Demo data
docs/
  s3-setup.md         AWS S3 configuration guide
```

## Development notes

- **Dynamic data needs Suspense.** `cacheComponents` is enabled, so any component that reads `headers()`, `params`, `searchParams`, the session or the database must be rendered inside `<Suspense>`.
- **Regenerate the Prisma client after migrations.** `prisma migrate dev` does not do it, so run `prisma generate` afterwards. The Prisma config lives in `prisma7.config.ts`.
- **Demo data:** the seeded instructors (`*.demo@mlimalms.com`) cannot log in. Remove them and their courses before launch.

## Roadmap

- M-Pesa checkout for paid courses (enrollment is free during the beta)
- Finish the AWS S3 configuration, and use signed CloudFront URLs for paid videos
- Replace the mock data on the learner dashboard, live classes, revision and children pages
- Course reviews and ratings, certificates and instructor payouts

## Deployment

The app can be deployed to [Vercel](https://vercel.com) or any Node.js host:

1. Set the environment variables listed above.
2. Run `pnpm exec prisma migrate deploy` against the production database.
3. Build the app with `pnpm build`.
4. Add the production URL to the GitHub OAuth app and to the S3 CORS rules.
