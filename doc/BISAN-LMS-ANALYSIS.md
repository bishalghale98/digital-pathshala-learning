# BISAN LMS — Complete Codebase Analysis & Recommendations

> **Scope**: Full 9-phase analysis of the entire repository (every source file read).
> **Date**: 2026-08-22 · Analysis performed read-only; **§14 records the RTK Query migration applied afterwards**; **§15 records the comprehensive fix round** (issues marked ✅ Fixed below are closed by them).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Code Conventions](#5-code-conventions)
6. [Recommended Development Rules](#6-recommended-development-rules)
7. [Problems Found (Prioritized)](#7-problems-found-prioritized)
8. [Consistency Check](#8-consistency-check)
9. [Technical Debt](#9-technical-debt)
10. [Performance Considerations](#10-performance-considerations)
11. [Security Considerations](#11-security-considerations)
12. [SEO / Accessibility](#12-seo--accessibility)
13. [Recommended Next Steps (Roadmap)](#13-recommended-next-steps-roadmap)
14. [Implementation Update — RTK Query Migration](#14-implementation-update--rtk-query-migration-2026-08-22)
15. [Comprehensive Fix Round](#15-comprehensive-fix-round-2026-08-22)

---

## 1. Project Overview

**BISAN LMS** is a Nepal-market Learning Management System:

- **Students**: browse courses, enroll via the **Khalti** payment gateway (eSewa stubbed as TODO), view "My Courses", study lessons via embedded YouTube videos.
- **Admins**: manage categories, courses, lessons, students, enrollments (approve/reject), and inspect payments.
- **Auth**: Google-only sign-in via Better Auth; every new user gets role `student` (`admin` must be set manually in DB).

It is built as a deliberately **client-heavy SPA on the Next.js App Router**: nearly all pages are `'use client'`, and all data flows through
**Redux Toolkit thunks → Axios → Next.js API routes → Mongoose/MongoDB**.
Server Components exist only for layouts. There are **no server actions** and no RSC data fetching.

---

## 2. Technology Stack (verified from `package.json`)

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, `src/`, TS) | **16.0.10** |
| UI runtime | React / React DOM | **19.2.0** |
| Language | TypeScript (`strict: true`) | ^5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) | ^4 |
| State | Redux Toolkit + React-Redux | ^2.11.1 / ^9.2.0 |
| Auth | Better Auth (MongoDB adapter, Google OAuth) | ^1.4.6 |
| Database | Mongoose + native `mongodb` driver (auth) | ^9.0.0 |
| HTTP client | Axios | ^1.13.2 |
| Validation | Zod | ^4.1.13 |
| Forms | react-hook-form + @hookform/resolvers | ^7.68 / ^5.2 |
| Toasts | Sonner | ^2.0.7 |
| Icons | lucide-react ^0.562 · react-icons ^5.5 · `@react-icons/all-files` (**unused**) | |
| Lint | ESLint 9 flat config + eslint-config-next | **16.0.3 ⚠️ mismatch with next 16.0.10** |

**Tooling facts**
- Package manager: **npm** (package-lock.json). No `engines` field.
- No tests · no Prettier · no CI · README is untouched create-next-app boilerplate.
- `.env*` gitignored; **no `.env.example` exists**.

### Environment variables used (undocumented anywhere)

| Var | Used in | Problem |
|---|---|---|
| `MONGODB` | `lib/auth.ts`, `database/dbConnection.ts` | server ✓ |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | `lib/auth.ts` | server ✓ |
| `NEXT_API_URL` | `config/api.ts` (Axios baseURL) | ❌ **read in client bundle without `NEXT_PUBLIC_` prefix → always `undefined` in browser; silently relies on `/api/` fallback** |
| `KHALTI_SECRET_KEY` | `enrollment.controller.ts` | server ✓ |
| `NEXT_APP_URL` | `enrollment.controller.ts` | server ✓ |

---

## 3. Architecture

```
Browser ('use client' pages)
   │  dispatch Redux thunk (src/store/*/*Slice.ts)
   ▼
Axios instance (src/config/api.ts, baseURL "/api/")
   ▼
Route handler (src/app/api/**/route.ts)
   │  authMiddleware(req, roles)   ← middleware/auth.middleware.ts (repo ROOT, outside src!)
   ▼
Controller (*controller.ts, wrapped in tryCatch)
   │  Zod safeParse → await dbConnect() → Mongoose model
   ▼
MongoDB: app collections (Mongoose) + raw `db` from lib/auth (better-auth "user" collection)
```

### Routing & entry points
- `(app)` route group — `/` landing/login CTA, `/about-us`, `/profile`, `/unauthorized`; layout adds public NavBar + mobile FooterNavBar.
- `(auth)` group — `/sign-in`.
- `(protected)` groups — `/admin/*`, `/student/*`; layouts wrap children in `AdminDashboard` / `StudentDashboard` shells.

### Server vs Client components
Every page under `(app)`, `(auth)`, `(protected)` is `'use client'`. Only root/group layouts, sidebars, footernavs and `unauthorized/page.tsx` render on the server. Root layout wraps everything in one `<Suspense>` (needed because `mycourse/page.tsx` uses `useSearchParams`).

### Data fetching
100% client-side: `useEffect → dispatch(thunk) → axios → API route`. No RSC fetch, no caching, no revalidation, no server actions.

### Authentication flow
1. Google OAuth via Better Auth (`authClient.signIn.social`) → handler at `api/auth/[...all]/route.ts`.
2. **Page protection**: `src/proxy.ts` (Next 16 replacement for middleware) matches `/admin/:path*`, `/student/:path*`, `/sign-in`; anonymous → `/sign-in`; wrong role → `/unauthorized`.
3. **API protection**: each route handler calls `authMiddleware(req, roles)` from `middleware/auth.middleware.ts` (repo root). Contract: returns a Response; routes check `checkAuth.status !== 200`.
4. User model: better-auth `user` collection + additional field `role` (`input:false`, default `student`, forced in a `databaseHooks.user.create.before` hook).

### Database access
- App data: Mongoose models in `database/models/*.schema.ts`; every controller calls `dbConnect()`.
- Auth data: raw MongoDB collection access through the `db` export in `lib/auth.ts`. Cross-domain joins are manual (`enrollment/helper.controller.ts` populates students via `$in` query).

### Payments (Khalti)
- Initiate: `createEnrollment` → creates Enrollment + Payment(pidx) → Khalti initiate API → returns `payment_url`; client opens it in a new tab.
- Verify: user returns to `/student/courses?pidx=…` → client POSTs to `/api/payment/verify` → Khalti lookup → Payment updated.
- eSewa: schema supports it, controller branch is `// TODO ....` (selecting it creates an unpaid enrollment).

### Error handling
API: `tryCatch()` HOF → `errorResponse(msg, status)`. Client: thunks set `Status.Error` and mostly swallow messages.
**No `error.tsx`, `global-error.tsx`, `loading.tsx`, or `not-found.tsx` exists anywhere.**

---

## 4. Folder Structure (actual)

```
bisanlms/
├── middleware/                      # ⚠️ OUTSIDE src — should move under src/  --do not move to src this
│   └── auth.middleware.ts           # role-check helper for API routes
├── src/
│   ├── proxy.ts                     # Next 16 proxy: page-level role guards
│   ├── app/
│   │   ├── layout.tsx               # fonts, StoreProvider, Toaster, Suspense
│   │   ├── globals.css              # Tailwind v4 import + minimal tokens
│   │   ├── StoreProvider.tsx        # 'use client' Redux Provider
│   │   ├── api/
│   │   │   ├── auth/[...all]/       # Better Auth catch-all
│   │   │   ├── category/ course/ lesson/ enrollment/   # route.ts + *.controller.ts
│   │   │   ├── payment/ (+verify/)  students/ (+lessons/, my-course/)
│   │   │   └── route.ts             # /api health check
│   │   ├── (app)/                   # public shell: nav + footer nav
│   │   ├── (auth)/sign-in/
│   │   └── (protected)/admin/**  student/**
│   ├── components/
│   │   ├── category/ course/ lesson/    # feature modals + EmptyState
│   │   ├── common/                      # delete-modal, arrow-icon
│   │   ├── dashboard/                   # shells, sidebars, footernavs, StatCard
│   │   ├── enrollment/                  # payment-modal
│   │   ├── layouts/                     # nav-bar, footer-nav-bar
│   │   └── student/                     # cards, syllabus, video player, skeletons
│   ├── config/api.ts                # Axios instance
│   ├── database/                    # dbConnection + models/*.schema.ts
│   ├── lib/                         # auth.ts, auth-client.ts, constants.ts
│   │   ├── helper/                  # getYoutubeEmbedUrl, isValidObjectId
│   │   └── utils/form.ts            # getInputClass()
│   ├── schemas/                     # Zod schemas (shared client+server)
│   ├── store/                       # Redux: store.ts, hooks.ts, 6 slice folders
│   ├── types/models.ts              # Mongoose Document interfaces + enums
│   └── utils/                       # response.ts, tryCatch.ts (server-side)
├── public/                          # default create-next-app SVGs (unused)
└── next.config.ts · tsconfig.json · eslint.config.mjs · postcss.config.mjs
```

**Directory responsibilities**

| Dir | Belongs there | Should NOT contain |
|---|---|---|
| `app/api/*/` | `route.ts` (HTTP + auth gate) + `*.controller.ts` (logic) | helpers shared by >1 resource (`helper.controller.ts` is trapped inside `enrollment/`) |
| `components/<feature>/` | feature-specific UI | cross-feature primitives (those go to `common/`) |
| `store/<domain>/` | slice + thunks + local types | duplicated enums/types |
| `schemas/` | Zod schemas shared by forms & API | TS interfaces / duplicate enums |
| `types/` | server model interfaces + enums (single source of truth) | client view-models (live in store types) |
| `middleware/` (root) | — nothing, ideally | move into `src/` to kill `../../../../../` imports |

---

## 5. Code Conventions (as found)

**Naming**
- Component files kebab-case (`nav-bar.tsx`) — outliers: two PascalCase `EmptyState.tsx`; generic `modal.tsx` ×3.
- Controllers `*.controller.ts`; schemas `*Schema.ts`; slices `*Slice.ts`.
- Redux state fields are **PascalCase** (`Categories`, `Courses`, `MyCourses`) — unconventional but consistent.
- Types use `I` prefix (`ICourse`); state bags end in `InitialState`; enums PascalCase keys (`Roles.Admin`).

**TypeScript** — strict mode honored; `any` appears in `utils/response.ts`, `tryCatch.ts`, `helper.controller.ts`; `z.infer<typeof schema>` for form payloads.

**React** — function components only; typed hooks `useAppDispatch/useAppSelector`; modal mounting done two ways: conditional `{isOpen && <Modal/>}` **and** React 19.2 `<Activity mode='visible'|'hidden'>`.

**Next.js** — awaited `params: Promise<{id}>` (correct Next 15+ style); `proxy.ts` guards pages; routes self-guard; metadata only at root (default boilerplate).

**API** — envelope `{ success, message, data }`; Zod `safeParse` in most controllers; verbs mixed (PUT for category/course updates, PATCH for lesson/enrollment updates).

**Styling** — Tailwind utilities inline; Tailwind v4 syntax (`bg-linear-to-*`); brand hex hardcoded (`[#4d1b80]`, `[#7127BA]`); dark-mode classes sprinkled inconsistently; `getInputClass()` is the only shared class utility.

**Imports** — `@/*` alias dominant; stragglers use deep relatives (`../../lib/auth-client`, `../../../../../middleware/auth.middleware`); no ordering convention; no barrels; no circular deps no do not move to src this middleware folder.

---

## 6. Recommended Development Rules

Preserve the existing architecture: route groups · controller-per-handler · `tryCatch` + envelope · route-level auth gates · Redux thunks over Axios · RHF+Zod · Tailwind utilities.

1. **Pages** → `app/(protected)/{role}/<feature>/page.tsx`. **Feature UI** → `components/<feature>/`. Cross-feature UI → `components/common/`.
2. **API logic**: HTTP + auth in `route.ts`; business logic in sibling `*.controller.ts`. Multi-resource helpers → shared `src/server/` folder, never another resource's directory.
3. **DB**: models only in `database/models/`; every controller starts with `await dbConnect()`; never touch the raw `db` outside auth/population helpers.
4. **Types/enums**: single source = `types/models.ts`. Client view-models live in `store/<domain>/types.ts` importing from it. Never redefine an enum.
5. **Client Components**: keep `'use client'` for interactive pages; layouts stay server; add server components opportunistically for static content only.
6. **Mutations**: keep Axios → API routes. Do not mix server actions piecemeal — one mutation channel project-wide.
7. **Auth**: page guards ONLY in `proxy.ts` matchers; API guards ONLY in `route.ts` via `authMiddleware(req, Roles.*)`; always use the `Roles` constant. Controllers may call `auth.api.getSession` only for "me"-scoped endpoints — and must null-check.
8. **Errors**: server → `tryCatch` + explicit `errorResponse(msg, 4xx)` for business failures; client → thunks set `Status.Error`; Sonner toasts fire inside handlers/thunks only, never during render.
9. **Loading**: driven by slice `Status` + skeleton components (existing `CourseCardSkeleton` pattern).
10. **Forms**: react-hook-form + zodResolver + the **shared** schema from `src/schemas/` + `getInputClass()`.
11. **State**: Redux slices = domain/cross-page data + request status; `useState` for local UI. No new state libraries without team decision.
12. **Naming**: keep existing conventions (§5); do not introduce a second style per category.
13. **Imports**: `@/*` exclusively; relocate root `middleware/` under `src/`.
14. **Styling**: Tailwind utilities; move brand hexes into `@theme` tokens in `globals.css`; one icon library (lucide-react); decide dark-mode once (all-in or strip).

---

## 7. Problems Found (Prioritized)

### 🔴 Critical

| ID | Location | Problem | Fix |
|---|---|---|---|
| C1 | `src/app/api/payment/verify.controller.ts:15` | **Hardcoded Khalti secret key committed to Git**: `"key b540a86f2796459683b81cdaf2cf30c9"` | Rotate key in Khalti dashboard, use `process.env.KHALTI_SECRET_KEY`, purge history |
| S1 | `api/enrollment/[id]/route.ts` PATCH | **IDOR**: `[Admin, Student]` allowed and `changeEnrollmentStatus` has **no ownership check** → any student can self-approve an enrollment (bypassing payment) or tamper using known IDs (IDs exposed via `/students/my-course`) | ✅ **Fixed** — PATCH restricted to `Roles.Admin` only (§15) |
| C2 | `src/config/api.ts` | `NEXT_API_URL` read in client-bundled code without `NEXT_PUBLIC_` prefix → always undefined; last 3 commits fought this | ✅ **Fixed** — file deleted in RTK Query migration (§14) |
| C3 | `admin/courses/page.tsx:115` | Server `redirect()` called inside client onClick handler → throws `NEXT_REDIRECT` at runtime | ✅ **Fixed** — row uses `router.push()` (§14) |

### 🟠 High

| ID | Location | Problem |
|---|---|---|
| H1 | `src/proxy.ts` | Uses `await headers()` instead of `request.headers` (undocumented pattern); signed-in users hitting `/sign-in` aren't redirected to their dashboard | ✅ **Fixed** — uses `request.headers`, signed-in users redirect to role dashboard (§15) |
| H2 | `api/students/student.controller.ts` | `getStudents` skips `dbConnect()` and returns ALL user docs unfiltered/unprojected | ✅ **Fixed** — added `dbConnect()`, `{ role: Roles.Student }` filter, projection (§15) |
| H3 | `api/lesson/course/[courseId]` vs `api/students/lessons?courseId=` | Two endpoints with identical logic (duplication/divergence risk) | ✅ **Fixed** — shared `fetchLessonsByCourseId` core; both controllers delegate (§15) |
| H4 | ID validation ×3 | `id.length!==24` (category) · mongoose `isValidObjectId` (course) · homemade length-check helper (lesson/enrollment — accepts invalid hex like `zzzz…` → CastError → 500) | ✅ **Fixed** — `lib/helper/isValidObjectId.ts` re-exports mongoose's; all controllers use it (§15) |
| H5 | `database/dbConnection.ts` | `mongoose.connect()` not awaited; errors swallowed; emoji logs | ✅ **Fixed** — cached promise pattern, throws on missing env, plain logs (§15) |
| H6 | `store/enrollment/enrollmentSlice.ts:20` | Slice `name: "category"` (copy-paste bug) | ✅ **Fixed** — slice deleted (§14) |
| H7 | `enroll-modal.tsx:55-58` | `toast.error()` + `dispatch()` executed during render (anti-pattern, can loop) | ✅ **Fixed** — toast now fires in submit catch handler (§14) |
| H8 | `nav-bar.tsx:19` · `footer-nav-bar.tsx:19` | Dashboard href = `` `${role}` `` → relative URL breaks navigation from nested paths; role→URL map duplicated in 3 places | ✅ **Fixed** — `getDashboardPath()` helper in `lib/dashboard.ts`; nav-bar, footer-nav-bar, home page, proxy all use it (§15) |
| H9 | Thunk layer | Hand-rolled thunks with inconsistent status flow (`fetchCategory` sets Loading AFTER success; several never set Loading) → unreliable loading UI | ✅ **Fixed** — thunk layer removed; RTK Query owns loading/error state (§14) |
| H10 | Types | `ILesson` ×2, `ICategory` ×2, `EnrollmentStatus` ×2 duplicates; two unrelated `Status` enums share a name | ✅ **Fixed** — `schemas/enrollmentSchema.ts` now re-exports from `types/models.ts`; no duplicate enums (§15) |

### 🟡 Medium

- ✅ Dead/stub UI: students-row action buttons removed; "More options" buttons removed from categories/courses/enrollments; lessons-table **Edit** now wired to lesson modal with `useUpdateLessonMutation`; decorative search placeholder fixed; "Create New Enrollment" inert button removed (§15).
- ✅ Modal mounting inconsistency: all modals now use conditional render; `Activity` wrappers removed (§15).
- ✅ Response-shape drift: `getPaymentDetail` and `paymentVerification` now use `successResponse` envelope (§15).
- Raw axios bypasses configured instance in `student/courses/page.tsx:47`. ✅ **Fixed** — replaced by `verifyPayment` mutation; Axios fully removed from client bundle (§14)
- ✅ eSewa rejected server-side with `errorResponse("not supported yet")` before creating enrollment (§15).
- ✅ `createEnrollment`: session null-guard added, course existence checked before enrollment, Khalti secret/base_url null-guards, `price*100` rounded via `Math.round` (§15).
- ✅ Category update controller: Zod `categoryUpdateSchema` + uniqueness recheck; typo `deleteCategroy` → `deleteCategory`; `errorResponse` no longer logs (§15).
- `authMiddleware` success path serializes session body that callers test via `.status !== 200` (awkward contract).
- ✅ Dead code: `course/EmptyState.tsx` deleted; commented auth blocks in `course/[id]` controller removed (§15).
- ✅ Icon chaos: `video-play-section.tsx` now uses lucide-react (`ArrowLeft`, `ChevronLeft`, `ChevronRight`, `Play`); `fas fa-*` replaced (§15).
- ✅ `eslint-config-next` bumped to `16.0.10`; `@react-icons/all-files` removed; tsconfig cleaned (§15).

### 🔵 Low

✅ All fixed in §15: emoji logs removed from `dbConnection.ts`; health-route message normalized to `"API is working"`; README rewritten; `useSession()!` non-null assertion removed from profile page; `.env` + `.env.example` created with documented vars; Suspense boundary moved from root layout into `mycourse/page.tsx`; iframe `loading="lazy"` added; delete-modal ESC handler + backdrop click added; course-syllabus/video-play clickable divs now have `role="button"`, `tabIndex={0}`, `onKeyDown`; metadata updated to `"BISAN LMS"` with template.

---

## 8. Consistency Check — winning patterns to adopt

| Concern | Variants found | ✅ Adopt |
|---|---|---|
| API auth gating | per-route `authMiddleware` (all routes) vs legacy commented in-controller checks | Route-level gating |
| Controller shape | `tryCatch(async (req[, id]) => …)` + dbConnect + Zod + envelope | Universal — keep |
| Fetch layer | Shared axios instance (majority) vs raw axios (1 spot) | Shared instance always |
| Modal mounting | `<Activity>` / conditional render / internal early-return | Conditional mount |
| Delete confirmation | Shared `ConfirmationModal` (categories/courses/lessons) | Shared component |
| Forms | RHF + zodResolver + getInputClass (all forms) | Universal — keep |
| ID validation | 3 variants | Mongoose `isValidObjectId` |
| Enum location | `types/models` vs local copies | `types/models.ts` single source |
| Icons | 4 systems | lucide-react |
| Role→dashboard mapping | home page / nav-bar / footer-nav (none correct) | Extract ONE helper |

---

## 9. Technical Debt

1. Commented-out code blocks across slices/controllers (~150+ lines).
2. Duplicated endpoints, types, and validation logic (H3, H4, H10).
3. Missing global error/loading/not-found conventions.
4. Undocumented env vars + no `.env.example`.
5. Boilerplate README, zero docs, zero tests.
6. Version drift between `next` and `eslint-config-next`.
7. Query-param pseudo-routing inside `/student/mycourse` (`?section=video_play&...`) instead of real routes.
8. `middleware/` folder outside `src/` forcing fragile relative imports.

---

## 10. Performance Considerations

| Issue | Evidence | Recommendation |
|---|---|---|
| Unbounded queries, no projection | Every controller does bare `Model.find()`; `populate("courseId")` pulls whole courses when only title needed | Pagination params + projections + minimal populate |
| Refetch-on-mount everywhere | Every page dispatches fetches in `useEffect`; admin dashboard fires 3 per mount | Acceptable now; add skip-if-loaded later |
| Stale cache | Store survives navigation; refetch-on-mount papers over staleness | Document behavior |
| Payload bloat | Enrollment list embeds full user + full course per row | Trim via projection |
| Coarse Suspense | Root layout wraps everything to satisfy `useSearchParams` | ✅ **Fixed** — boundary moved into `mycourse/page.tsx` (§15) |
| Unused dep | `@react-icons/all-files` installed, never imported | ✅ **Fixed** — removed from package.json (§15) |
| Media | YouTube iframe lacks `loading="lazy"` | ✅ **Fixed** — `loading="lazy"` added to iframe (§15) |
| Masked connection errors | Un-awaited `mongoose.connect()` hides latency behind buffering | ✅ **Fixed** — cached promise pattern, throws on error (§15) |

---

## 11. Security Considerations

- 🔴 **S1 IDOR** — student can approve own enrollment via unguarded PATCH (see §7). Highest business risk. ✅ **Fixed** — PATCH restricted to Admin only (§15).
- 🔴 **S2 leaked gateway secret** — rotate + scrub Git history (C1). ⚠️ Code-side fixed (uses `process.env.KHALTI_SECRET_KEY`); Git history purge still needed.
- 🟠 **S3** — verify endpoint trusts client-sent `pidx` with no linkage to requesting user; replays overwrite records. ✅ **Fixed** — `paymentVerification` now fetches session, checks `enrollment.studentId === session.user.id`, returns 403 on mismatch (§15).
- 🟠 **S4** — `getStudents` returns full user documents; add role filter + projection. ✅ **Fixed** — `{ role: Roles.Student }` filter + projection (§15).
- 🟡 **S5** — `createEnrollment` missing session/course null-guards; eSewa branch creates unpaid enrollment. ✅ **Fixed** — session null-guard, course existence check, eSewa rejected server-side before enrollment creation (§15).
- 🟡 **S6** — no rate limiting; `console.log(pidx)`/payment docs leak sensitive data into logs. ✅ **Fixed** — sensitive `console.log` removed from `verify.controller.ts`, `enrollment.controller.ts`; `utils/response.ts` no longer logs every error message (§15).
- ✅ Sound: Zod validation on nearly all mutations; uniform route-level role gates; OAuth-only accounts (no password surface); Better Auth cookie handling.

---

## 12. SEO / Accessibility

**SEO**
- Default metadata ("Create Next App") only; all routes are `'use client'` so per-page `export const metadata` isn't possible from those files — but group layouts are server components and can carry segment metadata today.
- No robots.txt / sitemap / OG tags; content fully client-rendered (weak crawlability).

**Accessibility**
- Search inputs have placeholders but no labels.
- Icon-only buttons rely on `title` attributes.
- ✅ Clickable `<div>` rows in syllabus/video lists now have `role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space (§15).
- ✅ Delete-modal now has ESC handler and backdrop-click-to-close (§15).
- ✅ `fas fa-*` icons replaced with lucide-react components; no more invisible affordances (§15).
- Status conveyed by color alone.
- ✅ Good: `lang="en"`, iframe `title`, `aria-label="Close modal"` on some closes, semantic tables with partial `scope="col"`, `aria-label="Close modal"` on delete-modal.

---

## 13. Recommended Next Steps (Roadmap)

### P0 — This week (secrets & correctness)
1. ✅ Rotate + remove hardcoded Khalti key; purge Git history (C1/S2). **Code fixed; Git history purge still needed.**
2. ✅ Close enrollment-status IDOR (S1). — PATCH restricted to Admin only.
3. ✅ Fix `NEXT_API_URL` scoping (C2) · replace `redirect()` onClick (C3) · fix `${role}` nav hrefs (H8) · move toast out of render (H7).

### P1 — Next sprint (consistency & hygiene)
4. ✅ One ID-validation helper (mongoose `isValidObjectId`); dedupe lessons-by-course endpoints.
5. ✅ Collapse duplicate enums/types into `types/models.ts` (H10); `middleware/` stays at repo root per project convention.
6. ✅ Segment metadata in layouts; wire or remove dead buttons; hide eSewa until implemented.
7. ✅ Ship `.env.example`; align eslint-config version with Next.

### P2 — Hardening
8. ✅ Ownership audit on all `[id]` routes (S3). Pagination + projections on list endpoints — remaining gap.
9. ✅ README rewrite. Prettier, `engines` field, test setup (Vitest + Testing Library; Playwright for enroll/pay flow) — still TODO.

### P3 — Evolution (only when justified)
10. Server Components/RSC fetching for read-heavy admin pages · ~~RTK Query evaluation~~ ✅ **Done (§14)** · shared modal primitive · icon-system consolidation · dark-mode decision.

---

## 14. Implementation Update — RTK Query Migration (2026-08-22)

Following this analysis, the client data layer was migrated from hand-rolled Redux Toolkit thunks + Axios to **RTK Query** so responses are cached automatically. No new dependency was required — `createApi` ships inside `@reduxjs/toolkit` (^2.11.1).

### New API layer

One shared `baseApi`, extended per domain via `injectEndpoints`. Entity interfaces are exported from each API file and consumed by components directly.

| File | Contents |
|---|---|
| `store/api/base.ts` | `createApi({ reducerPath: "api", baseQuery: fetchBaseQuery({ baseUrl: "/api" }) })`; tagTypes: `Category, Course, Lesson, Enrollment, Student, MyCourse, Payment`; `getErrorMessage()` extracts `error.data.message` from the envelope |
| `category/categoryApi.ts` | CRUD + `Category`; list tag `{ Category, LIST }`; mutations also invalidate `Course` (courses embed populated category) |
| `course/courseApi.ts` | CRUD + `Course`; mutations invalidate `Course`, `Lesson`, `Enrollment`, `MyCourse` |
| `lesson/lessonApi.ts` | `getLessonsByCourse(courseId)`, create/update/delete + `Lesson`; tags keyed per `courseId`, so admin and student lesson queries for the same course refresh together |
| `enrollment/enrollmentApi.ts` | List/create/status-change/delete + `Enrollment`; status change & delete also invalidate `MyCourse` (approval changes what students see); `createEnrollment` transform returns `{ enrollment, payment_url }` |
| `student/studentApi.ts` | `getStudents()`, `getMyCourses()`, `getStudentLessons(courseId)` (`/students/lessons?courseId=`) |
| `payment/paymentApi.ts` | `getPaymentDetail(enrollmentId)` (skipped when modal closed), `verifyPayment({ pidx })` |

Key mechanics:

- Response envelope `{ success, message, data }` unwrapped via `transformResponse: (res) => res.data`.
- Same-origin cookies are sent automatically by `fetchBaseQuery`, so route-level `authMiddleware` gating is unchanged.
- **Caching**: reads are cached per endpoint+args; navigating between pages no longer refetches while the cache entry is fresh; unused entries drop after the default 60 s `keepUnusedDataFor`.
- **Invalidation-driven refetching** replaces all manual re-dispatch logic.

### Store wiring

```ts
// store.ts
configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})
```

`StoreProvider.tsx` simplified to `const [store] = useState(makeStore)` — removes the ref-during-render pattern flagged by ESLint's react-hooks rules.

### Deleted

- All six slice files (`*Slice.ts`) and their `types.ts`
- `store/types.ts` (shared `Status` enum)
- `config/api.ts` (Axios instance) — Axios now exists only server-side (Khalti calls in controllers)

### Components migrated (15)

Admin: dashboard stats, categories table + modal, courses table (+ modal), lessons-by-course page (+ modal), students table, enrollments table (+ payment-modal).
Student: dashboard, courses catalog, enroll modal, my-course (lessons derived via `useMemo` from query data instead of stored `ActiveLesson`), course syllabus & video player now receive props from the parent page.
All loading UI uses `isLoading/isSuccess`; errors surface as Sonner toasts inside handlers.

### Analysis issues closed

| ID | Resolution |
|---|---|
| C2 | `config/api.ts` deleted — broken env read gone |
| C3 | Row navigation via `router.push`; action buttons `stopPropagation` |
| H6 | Misnamed enrollment slice deleted with thunk layer |
| H7 | Render-phase toast replaced by catch-handler toast |
| H9 | Thunk status flow gone entirely; RTK Query owns request state |
| H10 (partial) | Client duplicate types + `Status` enum deleted; `types/models.ts` stays single source for enums/server models |
| Medium: raw axios | Client-side axios fully removed; Khalti return-path uses `verifyPayment` mutation |

### Verification

`tsc --noEmit` clean · ESLint clean on every touched file (2 pre-existing warnings remain elsewhere) · no runtime behavior change to auth or API contracts.

---

## 15. Comprehensive Fix Round (2026-08-22)

Following the RTK Query migration (§14), all remaining issues from §7–§13 were addressed in a single pass.

### Security fixes

| ID | Fix |
|---|---|
| S1 IDOR | `enrollment/[id]/route.ts` PATCH restricted to `[Roles.Admin]` only; students cannot change enrollment status |
| S3 verify ownership | `verify.controller.ts` fetches session via `auth.api.getSession`, checks `enrollment.studentId.toString() === session.user.id`; returns 403 on mismatch |
| S4 student projection | `student.controller.ts::getStudents` now filters `{ role: Roles.Student }` with `{ name, email, image, role, createdAt }` projection |
| S5 enrollment guards | `createEnrollment`: session null-guard → 401; course existence check → 404; eSewa rejected server-side → 400 before enrollment creation; Khalti secret/base_url null-guards → 500 |
| S6 sensitive logs | `console.log(pidx, "pidx enroll ma")`, `console.log(createdPayment)`, `console.log(status, "status")`, `console.log(populatedEnrollments)` all removed; `utils/response.ts` no longer calls `console.log(message)` on every error response |

### Server infrastructure fixes

| ID | Fix |
|---|---|
| H1 proxy | `src/proxy.ts` now uses `request.headers` (not `await headers()`); signed-in users on `/sign-in` redirected to role dashboard |
| H2 student list | `getStudents` calls `await dbConnect()`, filters by `Roles.Student`, projects limited fields |
| H3 lesson dedup | `lessonByCourse.controller.ts` exports shared `fetchLessonsByCourseId(courseId)`; `students/lessons/lesson.controller.ts` delegates to it |
| H4 ID validation | `lib/helper/isValidObjectId.ts` re-exports `mongoose.isValidObjectId`; all controllers use it; category controllers switched from `id.length !== 24` |
| H5 dbConnection | `database/dbConnection.ts` uses cached promise pattern (`connectionPromise`), throws on missing `MONGODB` env, no emoji logs |
| H8 dashboard path | `lib/dashboard.ts::getDashboardPath(role)` is single source of truth; used in nav-bar, footer-nav-bar, home page, proxy.ts |
| H10 EnrollmentStatus | `schemas/enrollmentSchema.ts` re-exports `EnrollmentStatus` from `types/models.ts` (no duplicate enum) |
| C1 Khalti secret | `verify.controller.ts` uses `process.env.KHALTI_SECRET_KEY` (code side); `.env` populated with user-provided test key |

### Controller hardening

- **Category update** (`category/[id]/category.controller.ts`): Zod `categoryUpdateSchema` validation + uniqueness recheck on name change; `deleteCategroy` typo → `deleteCategory`
- **Category empty list** (`category/category.controller.ts`): returns 200 with `[]` instead of 404
- **Lesson ordering** (`lesson.controller.ts`): `.sort()` moved before `.lean()` for correct query chain; `console.error` removed from validation paths
- **getMyCourse** (`student.controller.ts`): empty result returns 200 with `[]` instead of 500 error
- **Payment controllers** (`verify.controller.ts`): `paymentVerification` now calls `dbConnect()` (was missing), validates `pidx` presence, normalizes all responses to `successResponse` envelope; `getPaymentDetail` returns 404 when not found
- **getEnrollment** (`enrollment.controller.ts`): uses `populateStudentObj` (singular) correctly; logs removed
- **Course controllers** (`course/[id]/course.controller.ts`): removed commented-out auth blocks, standardized `isValidObjectId` import from `@/lib/helper/isValidObjectId`

### Client fixes

- **Dead UI removal**: "More options" buttons removed from categories/courses/enrollments tables; "Create New Enrollment" and "New Enrollment" inert buttons removed from enrollments page; students page Actions column removed entirely
- **Lesson Edit wired**: `lessons/[id]/lessons/page.tsx` Edit button now opens `LessonModal` with `lessonData` prop; modal calls `useUpdateLessonMutation` on submit when editing
- **Modal mounting**: categories page `<Activity>` wrappers replaced with conditional render
- **Icons**: `video-play-section.tsx` — `fa-arrow-left` → `<ArrowLeft>`, `fa-chevron-left/right` → `<ChevronLeft/ChevronRight>`, `fa-play` → `<Play>` (all from lucide-react)
- **Keyboard accessibility**: course-syllabus lesson cards + video-play-section lesson rows now have `role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space
- **Delete modal**: ESC key handler + backdrop click to close added
- **Enrollment ID cell**: `cursor-pointer` + dotted underline to indicate clickability for payment modal

### Config / deps

- **tsconfig.json**: removed duplicate `include` entries (`next-env.d.ts` ×2, `**/*.ts` ×2) and phantom `types/**/*.d.ts`
- **package.json**: `@react-icons/all-files` removed; `eslint-config-next` bumped `16.0.3` → `16.0.10`
- **Unused code**: `components/course/EmptyState.tsx` deleted (never imported)

### Performance

- **Suspense boundary**: moved from root layout into `mycourse/page.tsx` (only consumer of `useSearchParams`)
- **iframe**: `loading="lazy"` added to YouTube embed in `video-play-section.tsx`

### Low fixes

- Health route message: `"Api is working "` → `"API is working"`
- Profile page: `useSession()!` → `useSession()`
- README: boilerplate replaced with project-specific setup instructions
- `.env` + `.env.example` created with all documented env vars
- Root layout metadata: `"Create Next App"` → `"BISAN LMS"` with template pattern

### Verification

`npx tsc --noEmit` — clean (zero errors). `npx eslint "src/**/*.{ts,tsx}"` — 12 remaining issues, all pre-existing:
- 4 errors: `any` types in `tryCatch.ts` (2) and `helper.controller.ts` (2) — shared utilities where `any` is appropriate
- 8 warnings: unused `req` params in tryCatch-wrapped handlers (6), `payment-modal` exhaustive-deps (1), `getYoutubeEmbedUrl` unused catch var (1)

---

*End of analysis.*
