# ponytail-audit: bisanlms

## Ranked findings (biggest cut first)

**delete** Dead `src/proxy.ts` (unwired Next.js middleware, never imported). Delete it. [src/proxy.ts]

**delete** Dead `editor-bubble-menu.tsx` + `editor-floating-menu.tsx` (164+162 lines, zero imports). Delete both. [src/components/editor/]

**delete** Dead `student-footernav.tsx` + `admin-footernav.tsx` (49+41 lines, zero imports). Delete both. [src/components/dashboard/]

**delete** Dead `hooks.ts` entire file (`useAppDispatch`, `useAppSelector`, `useAppStore` exported, never imported anywhere). Delete it + `AppStore`/`RootState`/`AppDispatch` types from store.ts. [src/store/hooks.ts, src/store/store.ts:13-15]

**delete** Dead `Status` enum in types/models.ts (never imported, `EnrollmentStatus` from Prisma is used instead). [src/types/models.ts:2-6]

**delete** Dead `enrollmentUpdateSchema` (exported, never imported). [src/schemas/enrollmentSchema.ts:18-20]

**delete** Dead `category/empty-state.tsx` (26 lines, zero imports). [src/components/category/empty-state.tsx]

**delete** No-op `populateStudents`/`populateStudentObj` in helper.controller.ts (accept `any`, return input unchanged). Delete file, inline passthrough in enrollment.controller.ts. [src/server/modules/enrollment/helper.controller.ts]

**native** `axios` (2 trivial POST calls to Khalti). Replace with native `fetch`. [src/server/modules/payment/verify.controller.ts:25, src/server/modules/enrollment/enrollment.controller.ts:87]

**native** `react-icons` (500KB for one `FcGoogle` icon in 2 files). Inline 3-line SVG, delete dep. [src/components/public/sign-in/sign-in-page.tsx:9, sign-up-page.tsx:9]

**yagni** `@tiptap/extension-bubble-menu`, `@tiptap/extension-floating-menu`, `@tiptap/pm` (3 unused tiptap packages, components using them are dead code). Remove from package.json. [package.json]

**stdlib** Duplicate `slugify`/`generateSlug`/`getSlug` in 3 files (seed.ts, course.controller.ts, lib/helper/helper.ts). Keep one in helper.ts, import elsewhere. [3 files]

**shrink** `admin-stat-card.tsx` + `dashboard-stat-card.tsx` (39+40 lines, identical shape `{title, value, icon, color}`). Merge into 1 component. [src/components/dashboard/]

**shrink** `admin-dashboard.tsx` + `student-dashboard.tsx` (74+74 lines, same layout differing only by sidebar). Merge into `DashboardLayout({sidebar})`. [src/components/dashboard/]

**shrink** `admin-sidebar.tsx` + `student-sidebar.tsx` (157+119 lines, 90% shared). Merge into `Sidebar({navGroups, brand})`. [src/components/dashboard/]

**shrink** `getCourse()` helper duplicated in enrolled-course-card.tsx:15 and continue-learning-card.tsx:16. Extract to shared util. [2 files]

**shrink** `getCourseId()` helper duplicated in video-play-section.tsx:16 and course-syllabus.tsx:17. Extract to shared util. [2 files]

**stdlib** Date formatting `toLocaleDateString("en-US", {...})` copy-pasted in 6+ files with 4 different option objects. Extract shared `formatDate()`. [6+ files]

**stdlib** `getErrorMessage()` lives in `store/api/base.ts` but imported by 7 non-store files. Move to `src/utils/`. [src/store/api/base.ts:15-21]

**yagni** `ArrowIcon` component (7 lines, wraps `<ArrowRight>`, used once). Inline it. [src/components/common/arrow-icon.tsx]

**yagni** `getInputClass()` in lib/utils/form.ts overlaps `cn()` already available. Replace 3 call sites with `cn()`. [src/lib/utils/form.ts]

**yagni** `editor/index.ts` barrel exports `EditorToolbar`/`EditorLinkDialog` externally but nobody imports via barrel. Delete barrel. [src/components/editor/index.ts]

**yagni** `admin/courses/index.ts` barrel — `CourseEmptyState` exported but never imported. Remove from barrel. [src/components/admin/courses/index.ts]

**shrink** Duplicate `PublicCourse` / `PublicCourseBySlug` types (identical Prisma payloads). Deduplicate. [src/lib/queries/course.ts:6-18,40-52]

**shrink** `StatCardProps` / `DashboardStatCardProps` (identical interfaces in 2 files). Merge. [2 files]

**yagni** Duplicate PrismaClient: `lib/auth.ts` creates its own instead of importing singleton from `database/prisma.ts`. Import the singleton. [src/lib/auth.ts:7-11]

---

## Net

- **~1,350 lines removable** (dead files ~490, no-op helpers ~33, duplicate components ~300, duplicate utils/types ~120, barrel/abstraction cleanup ~60, shrink consolidations ~350)
- **5 dependencies removable**: `axios`, `react-icons`, `@tiptap/extension-bubble-menu`, `@tiptap/extension-floating-menu`, `@tiptap/pm` (~680KB saved)
