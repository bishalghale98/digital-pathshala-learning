# Project Architecture & Coding Conventions

## 1. Project Overview

**BISAN LMS** is a Learning Management System built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Redux Toolkit (RTK Query), MongoDB (Mongoose), and Better Auth. It supports two user roles (Admin and Student), Google OAuth login, course management, enrollment with Khalti payment integration, and structured video-based learning.

**Key architectural decisions:**
- App Router with route groups for public/auth/protected sections
- Client-side rendering with RTK Query (no Server Components for data fetching)
- Manual auth middleware (not Next.js edge middleware)
- Co-located API controllers with route handlers
- Domain-organized components and store slices
- All routes centralized in `src/lib/constants.ts`

---

## 2. Technology Stack

| Technology | Version | Usage |
|---|---|---|
| Next.js | 16.0.10 | App Router, API Routes, Turbopack |
| React | 19.2.0 | UI rendering, hooks |
| TypeScript | ^5 | Strict mode enabled |
| Tailwind CSS | v4 | CSS-first config via `@import "tailwindcss"` in globals.css |
| Redux Toolkit | ^2.11.1 | State management + RTK Query for data fetching |
| React Redux | ^9.2.0 | React bindings for Redux |
| Mongoose | ^9.0.0 | MongoDB ODM |
| Better Auth | ^1.4.6 | Authentication (Google OAuth, sessions) |
| React Hook Form | ^7.68.0 | Form state management |
| Zod | ^4.1.13 | Schema validation |
| @hookform/resolvers | ^5.2.2 | Zod + React Hook Form integration |
| Sonner | ^2.0.7 | Toast notifications |
| Lucide React | ^0.562.0 | Icon library (primary) |
| React Icons | ^5.5.0 | Icon library (secondary, limited use) |
| Axios | ^1.13.2 | HTTP client (available but not heavily used) |
| ESLint | ^9 | Flat config with Next.js core-web-vitals + TypeScript presets |

**Notable absences:** No Prettier, no shadcn/ui, no Tailwind config file (v4 CSS-first), no Docker, no test framework, no Storybook.

---

## 3. Project Structure

```
bisanlms/
├── .env.example                 # Environment variable template
├── .gitignore
├── eslint.config.mjs            # ESLint 9 flat config
├── middleware/                   # Custom auth middleware (NOT Next.js middleware)
│   └── auth.middleware.ts
├── next.config.ts               # Next.js config (Google image domains only)
├── package.json
├── postcss.config.mjs           # Tailwind v4 PostCSS plugin
├── tsconfig.json                # Strict mode, @/* path alias
├── public/                      # Static assets (5 SVG files)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout (fonts, StoreProvider, Toaster)
│   │   ├── StoreProvider.tsx    # Redux store provider (client component)
│   │   ├── globals.css          # Tailwind import + CSS variables
│   │   ├── (app)/               # Public route group (5 pages)
│   │   ├── (auth)/              # Auth route group (1 page)
│   │   ├── (protected)/         # Protected route group (admin: 8, student: 4 pages)
│   │   └── api/                 # API route handlers (9 domains)
│   ├── components/              # React components (26 files, 10 directories)
│   ├── config/                  # Empty directory (placeholder)
│   ├── database/                # Mongoose connection + 5 models
│   ├── lib/                     # Auth, constants, helpers, utils (6 files)
│   ├── proxy.ts                 # Route-level middleware function
│   ├── schemas/                 # Zod validation schemas (4 files)
│   ├── store/                   # Redux store + RTK Query slices (10 files)
│   ├── types/                   # TypeScript interfaces (1 file)
│   └── utils/                   # Response helpers, tryCatch wrapper (2 files)
├── middleware/                   # Root-level custom auth middleware
└── doc/                         # Existing analysis document
```

---

## 4. Folder-by-Folder Explanation

### `src/app/` - Next.js App Router

Uses route groups for section organization:

| Directory | Purpose | Layout | Pages |
|---|---|---|---|
| `(app)/` | Public pages | NavBar + FooterNavBar | home, courses, about-us, profile, unauthorized |
| `(auth)/` | Authentication | NavBar + FooterNavBar | sign-in |
| `(protected)/admin` | Admin dashboard | AdminDashboard sidebar | dashboard, analytics, categories, courses, courses/[id]/lessons, enrollments, settings, students |
| `(protected)/student` | Student dashboard | StudentDashboard sidebar | dashboard, courses, mycourse, settings |
| `api/` | API routes | N/A | 9 domains with controllers |

### `src/components/` - React Components

| Directory | Contents |
|---|---|
| `layouts/` | NavBar, FooterNavBar (shared across public + auth layouts) |
| `dashboard/` | Sidebars, stat cards, skeletons, empty states, course cards, dashboard wrappers (12 files) |
| `course/` | Course create/edit modal |
| `category/` | Category modal, EmptyState |
| `lesson/` | Lesson create/edit modal |
| `common/` | delete-modal, arrow-icon (shared across features) |
| `enrollment/` | Payment details modal |
| `student/course/` | course-card, course-syllabus, enroll-modal, video-play-section |
| `student/loading/` | course-card skeleton |

### `src/store/` - Redux Store + RTK Query

| File | Purpose |
|---|---|
| `store.ts` | Redux store factory with RTK Query middleware |
| `hooks.ts` | Typed hooks (useAppDispatch, useAppSelector, useAppStore) |
| `api/base.ts` | Base RTK Query API with tag types + getErrorMessage helper |
| `category/categoryApi.ts` | Category CRUD endpoints |
| `course/courseApi.ts` | Course CRUD endpoints |
| `enrollment/enrollmentApi.ts` | Enrollment endpoints |
| `lesson/lessonApi.ts` | Lesson CRUD endpoints |
| `payment/paymentApi.ts` | Payment detail query + verification mutation |
| `public/publicApi.ts` | Unauthenticated endpoints (courses, categories, stats) |
| `student/studentApi.ts` | Student endpoints (users, my-courses, lessons, progress) |

### `src/database/` - MongoDB/Mongoose

- `dbConnection.ts` - Singleton Mongoose connection
- `models/category.schema.ts` - Category (name unique, description, timestamps)
- `models/course.schema.ts` - Course (refs Category, timestamps)
- `models/enrollment.schema.ts` - Enrollment (refs Course/Lesson, status enum, completedLessons, lastAccessed)
- `models/lesson.schema.ts` - Lesson (refs Course, videoUrl, lessonNumber)
- `models/payment.schema.ts` - Payment (refs Enrollment, status/method enums, pidx, transactionId)

### `src/lib/` - Core Libraries

| File | Purpose |
|---|---|
| `auth.ts` | Server-side Better Auth config (MongoDB adapter, Google OAuth, role hook) |
| `auth-client.ts` | Client-side Better Auth React client |
| `constants.ts` | Roles enum + ROUTES map (all application routes) |
| `dashboard.ts` | `getDashboardPath()` role-to-URL mapper |
| `helper/getYoutubeEmbedUrl.ts` | Converts YouTube watch URLs to embed URLs |
| `helper/isValidObjectId.ts` | Re-exports `mongoose.isValidObjectId` |
| `utils/form.ts` | `getInputClass()` Tailwind class builder with error state |

### `src/schemas/` - Zod Validation Schemas

Separate from Mongoose models. Used for API request validation:

| File | Schemas |
|---|---|
| `categorySchema.ts` | `categoryCreateSchema`, `categoryUpdateSchema` |
| `courseSchema.ts` | `createCourseSchema` (used for create AND update) |
| `enrollmentSchema.ts` | `enrollmentCreateSchema`, `enrollmentStatusSchema` |
| `lessonSchema.ts` | `lessonCreateSchema`, `lessonUpdateSchema` |

### `src/types/` - TypeScript Types

`models.ts` - Mongoose document interfaces (ICategory, ICourse, ILesson, IEnrollment, IPayment) and enums (Status, EnrollmentStatus, PaymentMethod)

### `src/utils/` - Server Utilities

- `response.ts` - `successResponse()` / `errorResponse()` NextResponse builders
- `tryCatch.ts` - Generic async error wrapper returning `errorResponse`

### `middleware/` - Custom Auth Middleware (Root Level)

`auth.middleware.ts` - Route-level auth check. Called manually from API routes. NOT Next.js edge middleware.

### `src/proxy.ts` - Route Protection Logic

Session-based route protection for `/admin`, `/student`, `/sign-in`. Defines a `proxy()` function and `config.matcher`. **Note:** This file is NOT wired as standard Next.js middleware (no `middleware.ts` at root).

---

## 5. Next.js Architecture

### Router: App Router

All routing uses `src/app/` with the App Router pattern.

### Route Groups

| Route Group | Purpose | Layout Component |
|---|---|---|
| `(app)` | Public pages | `NavBar` + `FooterNavBar` + `mb-10` for mobile bottom nav |
| `(auth)` | Authentication | `NavBar` + `FooterNavBar` + `mb-10` |
| `(protected)/admin` | Admin dashboard | `AdminDashboard` (sidebar + topbar + mobile drawer) |
| `(protected)/student` | Student dashboard | `StudentDashboard` (sidebar + topbar + mobile drawer) |

### Server vs Client Components

**Almost everything is a Client Component.** The project is heavily client-rendered:

| Component Type | 'use client'? | Examples |
|---|---|---|
| Root layout | No (server) | `src/app/layout.tsx` |
| Route group layouts | No (server) | `(app)/layout.tsx`, `(auth)/layout.tsx`, `(protected)/*/layout.tsx` |
| StoreProvider | Yes (client) | `src/app/StoreProvider.tsx` |
| All page components | Yes (client) | Every `page.tsx` file |
| All dashboard components | Yes (client) | `student-dashboard.tsx`, `admin-dashboard.tsx` |
| All modal components | Yes (client) | `course/modal.tsx`, `category/modal.tsx` |
| All sidebar components | Yes (client) | `student-sidebar.tsx`, `admin-sidebar.tsx` |

**Pattern:** Server components are limited to layouts that compose client components. All data fetching happens via RTK Query on the client side. No Server Actions are used.

### Layout Hierarchy

```
Root Layout (server)
+-- StoreProvider (client)
    +-- (app)/layout (server) -> NavBar + main + FooterNavBar
    +-- (auth)/layout (server) -> NavBar + main + FooterNavBar
    +-- (protected)/admin/layout (server) -> AdminDashboard wrapper
    +-- (protected)/student/layout (server) -> StudentDashboard wrapper
```

### API Routes

All API routes live in `src/app/api/`. Each domain follows this pattern:

```
api/{domain}/
+-- route.ts                    # GET (list) + POST (create)
+-- {domain}.controller.ts      # Business logic for list/create
+-- [id]/
�   +-- route.ts                # GET (single) + PUT/PATCH/DELETE
�   +-- {domain}.controller.ts  # Business logic for single item
```

API routes use manual `authMiddleware()` - NOT Next.js edge middleware.

### Dynamic Routes

| Route | Parameter |
|---|---|
| `/courses/[id]` | Course ID (public) |
| `/admin/courses/[id]/lessons` | Course ID (admin) |
| `/api/course/[id]` | Course ID |
| `/api/category/[id]` | Category ID |
| `/api/enrollment/[id]` | Enrollment ID |
| `/api/lesson/[id]` | Lesson ID |
| `/api/lesson/course/[courseId]` | Course ID |

### Middleware / Proxy

There is **no standard Next.js middleware file** at root or `src/`. Route protection is handled by:

1. `src/proxy.ts` - Contains `proxy()` function + `config.matcher` (for `/admin`, `/student`, `/sign-in`)
2. `middleware/auth.middleware.ts` - Manual auth check called from API route handlers

### Metadata

Only the root layout defines metadata:
```ts
export const metadata: Metadata = {
  title: { default: "BISAN LMS - Online Learning Platform", template: "%s | BISAN LMS" },
  description: "Learn practical skills through structured online courses...",
  keywords: ["online learning", "courses", "education", "LMS", "e-learning", "BISAN"],
  openGraph: { title: "...", description: "...", type: "website", siteName: "BISAN LMS" },
};
```

Individual pages do NOT export metadata.

---

## 6. Component Architecture

### Component Organization

```
components/
+-- layouts/          # Shared layout components (NavBar, FooterNavBar)
+-- dashboard/        # Dashboard-specific (sidebars, stat cards, skeletons)
+-- course/           # Course CRUD modal
+-- category/         # Category CRUD modal + empty state
+-- lesson/           # Lesson CRUD modal
+-- common/           # Shared across features (delete-modal, arrow-icon)
+-- enrollment/       # Payment modal
+-- student/
    +-- course/       # Student course views (card, syllabus, enroll, video)
    +-- loading/      # Loading skeletons
```

### Naming Conventions

- **Files**: kebab-case (`nav-bar.tsx`, `course-card.tsx`, `dashboard-stat-card.tsx`)
- **Components**: PascalCase (`NavBar`, `CourseCard`, `DashboardStatCard`)
- **Modal files**: lowercase `modal.tsx` within their domain folder
- **Default exports**: Every component file has a default export
- **Named exports**: Some files also export named components (e.g., `SidebarContent`, `CourseGrid`)

### Component Patterns

1. All components use `'use client'`
2. Props defined as inline TypeScript annotations
3. No barrel files - components imported directly by path
4. Loading states use `animate-pulse` skeleton components
5. Empty states use consistent icon + text + action button pattern

### Modal Pattern

All modals follow this structure:

```tsx
'use client'
interface SomeModalProps { closeModal: () => void; /* optional data */ }
const SomeModal: React.FC<SomeModalProps> = ({ closeModal }) => {
  // react-hook-form + zodResolver
  // RTK Query mutations
  // sonner toast notifications
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg">
          {/* Header with close button */}
          {/* Form */}
          {/* Action buttons (Cancel / Submit) */}
        </div>
      </div>
    </div>
  );
};
export default SomeModal;
```

### Dashboard Layout Pattern

Dashboard pages use a wrapper component:

```tsx
// src/app/(protected)/student/layout.tsx
import StudentDashboard from '@/components/dashboard/student-dashboard';
export default function StudentLayout({ children }) {
  return <StudentDashboard>{children}</StudentDashboard>;
}
```

The wrapper handles: desktop sidebar, mobile drawer with backdrop, top bar with hamburger + avatar, main content area.

---

## 7. Feature Architecture

The project uses a **hybrid architecture** - organized by domain within a layered structure:

| Layer | Location | Contents |
|---|---|---|
| Pages/Routes | `src/app/` | Route groups, pages, layouts, API handlers |
| Components | `src/components/` | UI components organized by domain |
| State | `src/store/` | Redux store + RTK Query slices per domain |
| Business Logic | `src/app/api/*/` | Controllers co-located with API routes |
| Data Models | `src/database/models/` | Mongoose schemas |
| Validation | `src/schemas/` | Zod schemas for API input validation |
| Types | `src/types/` | Shared TypeScript interfaces |
| Auth | `src/lib/auth.ts`, `src/lib/auth-client.ts` | Server + client auth config |
| Constants | `src/lib/constants.ts` | Roles, routes |
| Utilities | `src/utils/`, `src/lib/helper/`, `src/lib/utils/` | Response builders, error wrappers, form helpers |

---

## 8. API & Data Fetching

### RTK Query (Primary)

All data fetching uses RTK Query. Base API in `src/store/api/base.ts`:

```ts
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Category", "Course", "Lesson", "Enrollment", "Student", "MyCourse", "Payment"],
  endpoints: () => ({}),
});
```

Each domain injects endpoints via `baseApi.injectEndpoints()`.

### API Route Pattern

| File | Exports | Auth |
|---|---|---|
| `api/{domain}/route.ts` | `GET` (list), `POST` (create) | `authMiddleware(req, [Roles...])` |
| `api/{domain}/[id]/route.ts` | `GET` (single), `PUT`/`PATCH`/`DELETE` | `authMiddleware(req, [Roles...])` |
| `api/{domain}/*.controller.ts` | Business logic functions | Wrapped with `tryCatch()` |
| `api/public/*/route.ts` | `GET` (public, no auth) | No auth middleware |
| `api/auth/[...all]/route.ts` | Better Auth catch-all | Handled by Better Auth |

### Controller Pattern

```ts
export const getCourses = tryCatch(async (req) => {
  await dbConnect();
  const courses = await Course.find().populate("categoryId").sort({ createdAt: -1 }).lean();
  return successResponse("Courses fetched successfully", courses, 200);
});
```

### Error Handling

- Controllers use `tryCatch()` wrapper from `@/utils/tryCatch`
- Errors returned via `errorResponse(message, statusCode)`
- Success returned via `successResponse(message, data, statusCode)`
- Client-side errors extracted via `getErrorMessage()` from `@/store/api/base`
- Toast notifications via `sonner`

### Cache Invalidation

RTK Query tags handle cache:
```ts
invalidatesTags: [{ type: "Course", id: "LIST" }]
providesTags: [{ type: "Course", id: "LIST" }]
```

---

## 9. State Management

### Redux Toolkit + RTK Query

**Store structure:**

```ts
// src/store/store.ts
export const makeStore = () => configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
```

**Typed hooks:**

```ts
// src/store/hooks.ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

**State management approach:**
- **Server state** -> RTK Query (courses, categories, enrollments, students, lessons, payments)
- **UI state** -> Local `useState` (modals, search, filters, sidebar toggle)
- **Auth state** -> Better Auth `useSession()` hook
- **URL state** -> `useSearchParams()` for mycourse page sections
- **No global client state** outside of RTK Query

**When NOT to use Redux:**
- Component-local UI state (modals, forms, toggles)
- Authentication state (use `authClient.useSession()`)
- URL-derived state (use `useSearchParams()`)

---

## 10. Authentication & Authorization

### Authentication Library: Better Auth

**Server config** (`src/lib/auth.ts`):

```ts
export const auth = betterAuth({
  database: { driver: mongoose, models: { user: { modelName: "user" } } },
  emailAndPassword: { enabled: false },
  socialProviders: { google: { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET } },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  databaseHooks: { user: { create: { after: async (user) => { /* set role to student */ } } } },
});
```

**Client config** (`src/lib/auth-client.ts`):

```ts
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
```

### Login Flow

1. User clicks "Sign In" -> navigates to `/sign-in`
2. Clicks "Continue with Google" -> `authClient.signIn.social({ provider: "google" })`
3. Better Auth handles OAuth redirect
4. On success, redirects to role-based dashboard

### Session Handling

- Client-side: `authClient.useSession()` returns `{ data: session, isPending }`
- Server-side (API routes): `auth.api.getSession({ headers: req.headers })`

### Role-Based Authorization

- Two roles: `admin` and `student` (defined in `src/lib/constants.ts`)
- Default role for new users: `student` (set in auth database hook)
- API routes check roles via `authMiddleware(req, [Roles.Admin])` or `authMiddleware(req, [Roles.Admin, Roles.Student])`

### Protected Routes

- `/admin/*` -> Only admin role allowed (checked in `src/proxy.ts`)
- `/student/*` -> Student or admin role allowed
- `/sign-in` -> Redirects authenticated users to dashboard

### Logout

```ts
await authClient.signOut();
router.push(ROUTES.SIGN_IN);
```

---

## 11. Database Architecture

### Database: MongoDB via Mongoose

**Connection** (`src/database/dbConnection.ts`):

```ts
let cached = global as any;
if (!cached.mongoose) cached.mongoose = { conn: null, promise: null };
export default async function dbConnect() { /* singleton pattern */ }
```

### Models

| Model | Fields | References |
|---|---|---|
| Category | name (unique), description, timestamps | - |
| Course | title, description, duration, price, categoryId, timestamps | Category |
| Lesson | courseId, title, description, videoUrl, lessonNumber, timestamps | Course |
| Enrollment | studentId, courseId, enrollmentStatus, enrolledAt, whatsapp, completedLessons[], lastAccessedLesson, lastAccessedAt, paymentMethod | Course, Lesson |
| Payment | enrollment, amount, status, paymentMethod, transactionId, pidx, timestamps | Enrollment |

### Better Auth User Collection

Better Auth manages its own `user` collection outside Mongoose. Accessed via raw MongoDB:

```ts
const db = mongoose.connection.db;
const user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
```

### Payment Integration

Khalti payment gateway:
- Initiate: `POST https://dev.khalti.com/api/v2/epayment/initiate/`
- Verify: `POST https://dev.khalti.com/api/v2/epayment/lookup/`

---

## 12. TypeScript Conventions

### Configuration

- Strict mode enabled
- Target: ES2017
- Module: ESNext with bundler resolution
- Path alias: `@/*` -> `./src/*`

### Interface vs Type

- **Interfaces** for Mongoose document models (`ICategory`, `ICourse`, etc.)
- **Types** for API payloads (`CoursePayload`, `LessonPayload`, `CreateEnrollmentPayload`)
- **Interfaces** for component props (inline, not separate files)

### Naming

- Interfaces: `I` prefix for Mongoose documents (`ICourse`, `ILesson`)
- Enums: PascalCase (`EnrollmentStatus`, `PaymentMethod`, `Roles`)
- API response types: Inline transforms in RTK Query

### Strictness Notes

- `strict: true` but some `any` types exist in `tryCatch.ts` and `helper.controller.ts`
- Unused variables trigger ESLint warnings (but not errors)

---

## 13. Form & Validation

### Libraries

- **React Hook Form** for form state
- **Zod** for schema validation
- **@hookform/resolvers** for integration

### Schema Location

`src/schemas/` - Separate from Mongoose models

### Pattern

```tsx
const { register, handleSubmit, formState: { errors, isValid } } = useForm<CourseFormData>({
  resolver: zodResolver(createCourseSchema),
  mode: "onChange",
  defaultValues: { title: "", description: "", ... },
});

const onSubmit = async (data: CourseFormData) => {
  try {
    await createCourse(data).unwrap();
    toast.success("Course created");
    reset();
    closeModal();
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
```

### Input Styling

```ts
// src/lib/utils/form.ts
export const getInputClass = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-colors ${
    hasError ? "border-red-500" : "border-gray-200"
  }`;
```

---

## 14. Styling & UI Conventions

### Tailwind CSS v4

Configuration is CSS-first in `globals.css`:

```css
@import "tailwindcss";
:root { --background: #ffffff; --foreground: #171717; }
@theme inline { --color-background: var(--background); --color-foreground: var(--foreground); }
```

No `tailwind.config.*` file exists. All customization via CSS.

### Design System

- **No component library** - All UI is custom-built with Tailwind utility classes
- **Colors**: Blue-600 primary, gray-900 for text/active states, green-500/600 for success, red-500/600 for errors
- **Borders**: `border-gray-200` for cards, `border-gray-100` for dividers
- **Border radius**: `rounded-lg` for buttons/inputs, `rounded-xl` for cards, `rounded-full` for badges/avatars
- **Shadows**: `shadow-sm` for cards, `shadow-lg` for modals/floating elements
- **Breakpoints**: `md:` (768px) for desktop sidebar toggle, `sm:` for small grid adjustments
- **Dark mode**: CSS variables defined but NOT actively used in components

### Responsive Design

- Mobile: Single column, bottom nav bar (`md:hidden`), hamburger menu
- Desktop: Multi-column grids, sidebar navigation, no bottom nav

---

## 15. Naming Conventions

### Files

| Type | Convention | Example |
|---|---|---|
| Components | kebab-case | `nav-bar.tsx`, `course-card.tsx` |
| Modals | lowercase | `modal.tsx` (within domain folder) |
| Pages | `page.tsx` | Standard Next.js |
| Layouts | `layout.tsx` | Standard Next.js |
| API routes | `route.ts` | Standard Next.js |
| Controllers | `{domain}.controller.ts` | `course.controller.ts` |
| Store slices | `{domain}Api.ts` | `courseApi.ts` |
| Schemas | `{domain}Schema.ts` | `courseSchema.ts` |
| Models | `{domain}.schema.ts` | `course.schema.ts` |
| Types | `models.ts` | Single file for all Mongoose interfaces |
| Utils | camelCase | `response.ts`, `tryCatch.ts` |

### Code

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `NavBar`, `CourseCard`, `DashboardStatCard` |
| Functions | camelCase | `getDashboardPath`, `getErrorMessage`, `getInputClass` |
| Variables | camelCase | `navLinks`, `displayCourses`, `filteredCourses` |
| Constants | UPPER_SNAKE | `ROUTES`, `Roles` |
| Types/Interfaces | PascalCase | `ICourse`, `CoursePayload`, `EnrollmentStatus` |
| Enums | PascalCase | `EnrollmentStatus`, `PaymentMethod` |
| API functions | camelCase | `getCourses`, `createCourse`, `useGetCoursesQuery` |

---

## 16. Import Conventions

### Path Aliases

```ts
import X from '@/components/layouts/nav-bar';     // @/* -> ./src/*
import { auth } from '@/lib/auth';
import { ROUTES } from '@/lib/constants';
```

### Import Ordering (observed pattern, not enforced)

1. React/Next.js imports
2. Third-party libraries
3. Internal `@/` imports (components, lib, store, types, utils)
4. Relative imports (rare)

### No Barrel Files

Components are imported directly by path:

```ts
import NavBar from '@/components/layouts/nav-bar';
import { useGetCoursesQuery } from '@/store/course/courseApi';
```

### Type Imports

Type-only imports are NOT consistently used. Some files use `import type`:

```ts
import type { Course } from '@/store/course/courseApi';
import type { MyCourse } from '@/store/student/studentApi';
```

But many files import types alongside values without `type` keyword.

---

## 17. Error Handling

### API Level

- Controllers wrapped with `tryCatch()` utility
- Returns `errorResponse(message, statusCode)` or `successResponse(message, data, statusCode)`
- Uses `@/utils/response.ts` helpers

### Client Level

- RTK Query errors extracted via `getErrorMessage()` from `@/store/api/base`
- Toast notifications via `sonner`: `toast.success()`, `toast.error()`
- Loading states with skeleton components
- Empty states with icon + message + action button

### Auth Errors

- 401 -> Redirect to `/sign-in`
- 403 -> Redirect to `/unauthorized`

---

## 18. Security Practices

### Authentication

- Better Auth handles session management
- Sessions signed with `BETTER_AUTH_SECRET`
- HTTP-only cookies for session storage

### Authorization

- API routes manually check roles via `authMiddleware()`
- Route groups separate public/protected sections
- `src/proxy.ts` provides route-level protection

### Input Validation

- Zod schemas validate all API inputs
- Mongoose schemas provide database-level validation

### Environment Variables

- `.env.example` documents required variables
- `.gitignore` excludes `.env*` files
- Server-only: `MONGODB`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `KHALTI_SECRET_KEY`
- Client-safe: `NEXT_APP_URL`, `BETTER_AUTH_URL`

### API Protection

- Public API routes (`/api/public/*`) have no auth
- Protected API routes check session + role
- Khalti secret key only used server-side

---

## 19. Development Workflow

### Commands

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in MongoDB URI, Better Auth secret, Google OAuth credentials, Khalti key
3. `npm install`
4. `npm run dev`

### No Tests

No test framework is configured. No test files exist.

### No Formatting

No Prettier config. Formatting depends on editor settings.

---

## 20. Existing Inconsistencies

### 1. Middleware Location

- **Pattern A**: `middleware/auth.middleware.ts` (root-level directory, NOT Next.js middleware)
- **Pattern B**: `src/proxy.ts` (src root, defines `proxy()` + `config.matcher`)
- **Issue:** `proxy.ts` is not wired as standard Next.js middleware. There is no `middleware.ts` at root or `src/`.
- **Dominant:** The manual `authMiddleware()` pattern in API routes is actually used. `proxy.ts` appears to be unused or partially integrated.

### 2. Stat Card Components

- **Pattern A**: `dashboard-stat-card.tsx` - `bg-blue-50`, no hover
- **Pattern B**: `admin-stat-card.tsx` - `bg-blue-100`, with `hover:shadow-md`
- **Issue:** Two near-identical components with different color shades
- **Dominant:** Both are used in their respective dashboards

### 3. Dashboard Wrapper Components

- **Pattern A**: `student-dashboard.tsx` - Uses `<img>` for avatar
- **Pattern B**: `admin-dashboard.tsx` - Uses `<img>` for avatar
- **Issue:** Both use `<img>` instead of `next/image`, triggering ESLint warnings
- **Dominant:** `<img>` usage (consistent but suboptimal)

### 4. HTTP Methods for Updates

- **Pattern A**: Course and Category use `PUT` for updates
- **Pattern B**: Lesson uses `PATCH` for updates
- **Pattern C**: Enrollment status uses `PATCH`
- **Issue:** Inconsistent HTTP methods for update operations
- **Dominant:** Mixed usage

### 5. Auth Middleware Redundancy

- **Issue:** `category/[id]/category.controller.ts` calls `authMiddleware()` twice (once in route, once in controller)
- **Dominant:** Most controllers rely on route-level auth only

### 6. Icon Libraries

- **Pattern A**: `lucide-react` (primary, used in most components)
- **Pattern B**: `react-icons` (secondary, used only in footer-nav-bar.tsx)
- **Issue:** Two icon libraries when one would suffice
- **Dominant:** `lucide-react`

### 7. Modal Styling

- **Pattern A**: Category/lesson modals use purple submit button (`bg-[#4d1b80]`)
- **Pattern B**: Course modal uses blue submit button (`bg-blue-600`)
- **Issue:** Inconsistent button colors across modals
- **Dominant:** Mixed

### 8. File Naming for Empty States

- **Pattern A**: `category/EmptyState.tsx` (PascalCase)
- **Pattern B**: `dashboard/dashboard-empty-state.tsx` (kebab-case)
- **Issue:** Inconsistent naming convention
- **Dominant:** kebab-case

---

## 21. Do's and Don'ts

### Do's

- Use `'use client'` on all new page and component files
- Use `ROUTES` constants from `@/lib/constants` for all navigation links
- Use RTK Query for all data fetching (create a new API slice if needed)
- Use `react-hook-form` + `zodResolver` for all forms
- Use `tryCatch()` wrapper for all API controllers
- Use `successResponse()` / `errorResponse()` for API responses
- Use `sonner` toast for user feedback
- Use `lucide-react` for icons
- Use `getInputClass()` for form input styling
- Use `getErrorMessage()` for extracting RTK Query errors
- Organize components by domain in `src/components/`
- Organize API routes with co-located controllers
- Use the existing modal pattern for create/edit forms
- Use skeleton components for loading states
- Use empty state components for zero-data scenarios

### Don'ts

- Don't use Server Components for data fetching (project uses client-side RTK Query)
- Don't create a new `middleware.ts` at root without understanding `src/proxy.ts`
- Don't add new dependencies without checking if existing ones suffice
- Don't hardcode route strings - use `ROUTES` from `@/lib/constants`
- Don't create barrel files (`index.ts`) for component exports
- Don't use `react-icons` - prefer `lucide-react` for consistency
- Don't create separate interface files for component props - use inline types
- Don't add comments unless explicitly requested
- Don't modify `.env` files - only `.env.example` should be committed
- Don't use `any` type - use proper TypeScript types
- Don't create duplicate API endpoints - check existing routes first

---

## 22. How to Write New Code in This Project

### New Page

1. Create `page.tsx` in the appropriate route group:
   - Public: `src/app/(app)/your-page/page.tsx`
   - Auth: `src/app/(auth)/your-page/page.tsx`
   - Admin: `src/app/(protected)/admin/your-page/page.tsx`
   - Student: `src/app/(protected)/student/your-page/page.tsx`
2. Add `'use client'` at the top
3. Add route to `ROUTES` in `src/lib/constants.ts`
4. Use RTK Query for data fetching

### New Component

1. Create in `src/components/{domain}/your-component.tsx`
2. Use kebab-case file naming
3. Use PascalCase component naming
4. Export as default
5. Add `'use client'` if it uses hooks or interactivity

### New Modal

1. Create in `src/components/{domain}/modal.tsx`
2. Follow the existing modal pattern (overlay + backdrop + card)
3. Use `react-hook-form` + `zodResolver`
4. Use `sonner` for toast notifications
5. Accept `closeModal` prop

### New API Route

1. Create `src/app/api/{domain}/route.ts` for list/create
2. Create `src/app/api/{domain}/[id]/route.ts` for single item operations
3. Create `src/app/api/{domain}/{domain}.controller.ts` for business logic
4. Use `authMiddleware()` for protected routes
5. Use `tryCatch()` wrapper for controllers
6. Use `successResponse()` / `errorResponse()` for responses
7. Use Zod schema for input validation

### New RTK Query Slice

1. Create `src/store/{domain}/{domain}Api.ts`
2. Use `baseApi.injectEndpoints()`
3. Define types in the same file
4. Export typed hooks

### New Zod Schema

1. Create in `src/schemas/{domain}Schema.ts`
2. Use separate schemas for create vs update if needed
3. Import in controller and/or form component

### New Mongoose Model

1. Create in `src/database/models/{domain}.schema.ts`
2. Define interface in `src/types/models.ts`
3. Import model in controllers that need it

---

## 23. Example Patterns

### Creating a new RTK Query endpoint

```ts
// src/store/feature/featureApi.ts
import { baseApi } from "../api/base";

export interface Feature {
  _id: string;
  name: string;
  createdAt: string;
}

type FeaturePayload = { name: string };

export const featureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<Feature[], void>({
      query: () => "feature",
      transformResponse: (res: { data: Feature[] }) => res.data,
      providesTags: [{ type: "Feature", id: "LIST" }],
    }),
    createFeature: builder.mutation<Feature, FeaturePayload>({
      query: (body) => ({ url: "feature", method: "POST", body }),
      invalidatesTags: [{ type: "Feature", id: "LIST" }],
    }),
  }),
});

export const { useGetFeaturesQuery, useCreateFeatureMutation } = featureApi;
```

### Creating a new API route

```ts
// src/app/api/feature/route.ts
import { NextRequest } from "next/server";
import { createFeature, getFeatures } from "./feature.controller";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { Roles } from "@/lib/constants";

export async function GET() {
  return getFeatures();
}

export async function POST(req: NextRequest) {
  const checkAuth = await authMiddleware(req, [Roles.Admin]);
  if (checkAuth.status !== 200) return checkAuth;
  return createFeature(req);
}
```

### Creating a new controller

```ts
// src/app/api/feature/feature.controller.ts
import dbConnect from "@/database/dbConnection";
import Feature from "@/database/models/feature.schema";
import { successResponse, errorResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";

export const getFeatures = tryCatch(async () => {
  await dbConnect();
  const features = await Feature.find().sort({ createdAt: -1 }).lean();
  return successResponse("Features fetched", features, 200);
});

export const createFeature = tryCatch(async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  // Validate with Zod, create, return
});
```

---

## 24. Architecture Decision Summary

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | Modern React, Turbopack, file-based routing |
| Rendering | Client-side (RTK Query) | Simpler mental model, no SSR complexity |
| State Management | Redux Toolkit + RTK Query | Type-safe, automatic caching, tag-based invalidation |
| Authentication | Better Auth | Lightweight, Google OAuth support, role-based |
| Database | MongoDB + Mongoose | Flexible schema, good TypeScript support |
| Forms | React Hook Form + Zod | Performant, validated, type-safe |
| Styling | Tailwind CSS v4 | Utility-first, no config file needed |
| Icons | Lucide React | Consistent, tree-shakeable |
| Toast | Sonner | Simple, performant |
| API Pattern | Route + Controller co-location | Clear separation of HTTP handling from business logic |
| Route Protection | Manual authMiddleware per route | Fine-grained control, role-based |
| Component Organization | Domain-based | Groups related code together |
| Type Safety | TypeScript strict mode | Catches errors early |

---

*This document was generated by analyzing the actual source code of the BISAN LMS project. All conventions, patterns, and recommendations are based on what exists in the codebase.*
