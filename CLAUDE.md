# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build (output: `dist/client`)
- `npm run test` — Run tests with Vitest (`vitest run`)
- `npm run preview` — Preview production build
- `npx convex dev` — Start Convex dev server (run in separate terminal)
- `npx convex run seed:seedAll` — Seed the database with sample data

## Architecture

**Sip n' Dip Donuts** — a full-stack donut shop website built with:
- **TanStack Start** (React 19 SSR framework) with file-based routing
- **Convex** real-time backend (schema in `convex/schema.ts`, functions in `convex/*.ts`)
- **Tailwind CSS v4** with `@tailwindcss/typography`
- **Framer Motion** for animations and page transitions
- Deployed to **Netlify** via `@netlify/vite-plugin-tanstack-start`

### Route structure

Public pages: `/` (home), `/menu`, `/gallery`, `/about`, `/reviews`, `/contact`
Admin panel: `/admin` (layout with auth gate), `/admin/menu`, `/admin/gallery`, `/admin/reviews`, `/admin/about`, `/admin/settings`, `/admin/messages`

Routes live in `src/routes/`, route tree auto-generated in `src/routeTree.gen.ts`.

### Key files

- `src/routes/__root.tsx` — Root layout (Header + Outlet + Footer), meta tags, theme init script
- `src/routes/admin.tsx` — Admin layout route with sidebar nav and login form
- `src/styles.css` — Design system: donut-themed CSS custom properties (pink/brown/cream palette), light/dark mode
- `src/lib/convex.tsx` — ConvexProvider setup (requires `VITE_CONVEX_URL` env var)
- `src/lib/utils.ts` — `cn()`, `formatPrice()`, `formatDate()` helpers
- `convex/schema.ts` — Database schema (categories, menuItems, galleryPhotos, reviews, teamMembers, shopSettings, contactMessages, featuredDonuts)
- `convex/seed.ts` — Seed data with sample menu items, reviews, team members, shop settings

### Convex backend

Each table has a corresponding function file in `convex/` (e.g., `convex/menuItems.ts`, `convex/reviews.ts`). Functions follow the pattern: `list`/`listActive` queries, `create`/`update`/`remove` mutations. File uploads via `convex/files.ts` (`generateUploadUrl`, `getUrl`).

### Design system

- **Fonts:** "Baloo 2" (display/headings via `.display-title`), "DM Sans" (body)
- **Colors:** CSS vars — `--donut-pink`, `--chocolate`, `--cream`, `--sprinkle-*` accents
- **Components:** `.btn-primary` (pink), `.btn-secondary` (outlined), `.card-shell` (glass card), `.kicker` (uppercase label)
- **Theme:** Light/dark with auto detection, stored in `localStorage` key `'theme'`

### Path aliases

Both `#/*` and `@/*` map to `./src/*`.

### Current state

Public pages use static/demo data. Admin panel uses local React state. To connect to Convex:
1. Run `npx convex dev --once --configure=new` to create a deployment
2. Update `VITE_CONVEX_URL` in `.env.local`
3. Wrap app in `ConvexClientProvider` from `src/lib/convex.tsx`
4. Replace static data with `useQuery`/`useMutation` hooks from `convex/react`
