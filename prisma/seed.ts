import "dotenv/config";
import { PrismaClient, CourseStatus, EnrollmentStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Seed Data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "Learn to build modern websites and web applications",
    children: [
      { name: "Frontend", slug: "frontend", description: "Client-side development" },
      { name: "Backend", slug: "backend", description: "Server-side development" },
      { name: "Full Stack", slug: "full-stack", description: "End-to-end development" },
    ],
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Build mobile apps for iOS and Android",
    children: [
      { name: "React Native", slug: "react-native", description: "Cross-platform mobile apps" },
      { name: "Flutter", slug: "flutter", description: "Google's UI toolkit for mobile" },
    ],
  },
  {
    name: "Data Science",
    slug: "data-science",
    description: "Analyze data and build machine learning models",
    children: [
      { name: "Machine Learning", slug: "machine-learning", description: "AI and ML fundamentals" },
      { name: "Data Analysis", slug: "data-analysis", description: "Data visualization and analysis" },
    ],
  },
  {
    name: "DevOps",
    slug: "devops",
    description: "Deployment, infrastructure, and CI/CD",
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Design beautiful and user-friendly interfaces",
  },
];

const COURSES = [
  {
    title: "Complete Next.js 14 Course",
    shortDescription: "Master Next.js 14 with App Router, Server Components, and more",
    description:
      "A comprehensive course covering everything from Next.js basics to advanced patterns. Learn Server Components, Server Actions, Route Handlers, middleware, authentication, database integration with Prisma, deployment on Vercel, and performance optimization. Build real-world projects throughout the course.",
    duration: "8 weeks",
    price: 4999,
    keywords: "nextjs,react,typescript,web development,full stack",
    status: CourseStatus.PUBLISHED,
    categorySlug: "full-stack",
    lessons: [
      { title: "Introduction to Next.js 14", description: "Overview of Next.js and the App Router", lessonNumber: 1 },
      { title: "Project Setup", description: "Setting up the development environment", lessonNumber: 2 },
      { title: "App Router Deep Dive", description: "Understanding file-based routing", lessonNumber: 3 },
      { title: "Server Components", description: "Rendering on the server", lessonNumber: 4 },
      { title: "Client Components", description: "Interactive UI with client components", lessonNumber: 5 },
      { title: "Data Fetching", description: "Server-side data fetching patterns", lessonNumber: 6 },
      { title: "Server Actions", description: "Form handling and mutations", lessonNumber: 7 },
      { title: "Authentication", description: "Adding auth with Better Auth", lessonNumber: 8 },
      { title: "Database with Prisma", description: "ORM integration and queries", lessonNumber: 9 },
      { title: "Deployment", description: "Deploying to Vercel", lessonNumber: 10 },
    ],
  },
  {
    title: "React Fundamentals",
    shortDescription: "Learn React from scratch with hooks, context, and modern patterns",
    description:
      "Start your React journey from the ground up. This course covers JSX, components, props, state, hooks, context API, React Router, and modern patterns. Build several mini-projects to solidify your understanding and gain confidence.",
    duration: "6 weeks",
    price: 2999,
    keywords: "react,javascript,frontend,web development",
    status: CourseStatus.PUBLISHED,
    categorySlug: "frontend",
    lessons: [
      { title: "What is React?", description: "Introduction and overview", lessonNumber: 1 },
      { title: "JSX and Components", description: "Writing your first components", lessonNumber: 2 },
      { title: "Props and State", description: "Data flow in React", lessonNumber: 3 },
      { title: "Hooks Deep Dive", description: "useState, useEffect, and custom hooks", lessonNumber: 4 },
      { title: "Context API", description: "Global state management", lessonNumber: 5 },
      { title: "React Router", description: "Client-side routing", lessonNumber: 6 },
    ],
  },
  {
    title: "Node.js and Express API",
    shortDescription: "Build RESTful APIs with Node.js, Express, and MongoDB",
    description:
      "Learn to build production-ready REST APIs. Cover Express routing, middleware, validation, error handling, authentication, rate limiting, and deployment. Includes MongoDB integration with Mongoose and testing with Jest.",
    duration: "7 weeks",
    price: 3999,
    keywords: "nodejs,express,api,javascript,backend",
    status: CourseStatus.PUBLISHED,
    categorySlug: "backend",
    lessons: [
      { title: "Node.js Basics", description: "Runtime and module system", lessonNumber: 1 },
      { title: "Express Fundamentals", description: "Routing and middleware", lessonNumber: 2 },
      { title: "REST API Design", description: "RESTful conventions", lessonNumber: 3 },
      { title: "Data Validation", description: "Input validation with Joi/Zod", lessonNumber: 4 },
      { title: "Authentication", description: "JWT-based auth", lessonNumber: 5 },
      { title: "Error Handling", description: "Graceful error management", lessonNumber: 6 },
      { title: "Testing", description: "Unit and integration tests", lessonNumber: 7 },
    ],
  },
  {
    title: "TypeScript Mastery",
    shortDescription: "Become proficient in TypeScript for any JavaScript project",
    description:
      "Take your TypeScript skills to the next level. Learn advanced types, generics, utility types, type guards, decorators, and patterns. Apply TypeScript in real-world scenarios with React, Node.js, and more.",
    duration: "5 weeks",
    price: 2499,
    keywords: "typescript,javascript,programming,frontend,backend",
    status: CourseStatus.PUBLISHED,
    categorySlug: "frontend",
    lessons: [
      { title: "TypeScript Basics", description: "Types and interfaces", lessonNumber: 1 },
      { title: "Advanced Types", description: "Unions, intersections, generics", lessonNumber: 2 },
      { title: "Utility Types", description: "Partial, Pick, Omit, and more", lessonNumber: 3 },
      { title: "Type Guards", description: "Runtime type checking", lessonNumber: 4 },
      { title: "TS with React", description: "Typing components and hooks", lessonNumber: 5 },
    ],
  },
  {
    title: "React Native for Beginners",
    shortDescription: "Build cross-platform mobile apps with React Native",
    description:
      "Learn to build iOS and Android apps using React Native and Expo. Cover navigation, state management, API calls, native modules, and publishing to app stores. No prior mobile development experience needed.",
    duration: "8 weeks",
    price: 4499,
    keywords: "react native,mobile,javascript,cross-platform",
    status: CourseStatus.PUBLISHED,
    categorySlug: "react-native",
    lessons: [
      { title: "Getting Started", description: "React Native and Expo setup", lessonNumber: 1 },
      { title: "Core Components", description: "View, Text, Image, ScrollView", lessonNumber: 2 },
      { title: "Styling", description: "Flexbox and StyleSheet", lessonNumber: 3 },
      { title: "Navigation", description: "React Navigation setup", lessonNumber: 4 },
      { title: "State Management", description: "Context and Redux basics", lessonNumber: 5 },
      { title: "API Integration", description: "Fetching and displaying data", lessonNumber: 6 },
      { title: "Native Modules", description: "Accessing device features", lessonNumber: 7 },
      { title: "Publishing", description: "Build and release to stores", lessonNumber: 8 },
    ],
  },
  {
    title: "Python for Data Science",
    shortDescription: "Learn Python, NumPy, Pandas, and data visualization",
    description:
      "Start your data science journey with Python. Master the core libraries: NumPy for numerical computing, Pandas for data manipulation, Matplotlib and Seaborn for visualization. Work with real datasets and build foundational skills.",
    duration: "10 weeks",
    price: 3499,
    keywords: "python,data science,numpy,pandas,programming",
    status: CourseStatus.PUBLISHED,
    categorySlug: "data-analysis",
    lessons: [
      { title: "Python Basics", description: "Syntax, variables, and control flow", lessonNumber: 1 },
      { title: "Functions and OOP", description: "Functions, classes, and objects", lessonNumber: 2 },
      { title: "NumPy", description: "Arrays and numerical operations", lessonNumber: 3 },
      { title: "Pandas", description: "DataFrames and data manipulation", lessonNumber: 4 },
      { title: "Data Visualization", description: "Matplotlib and Seaborn", lessonNumber: 5 },
      { title: "Real Project", description: "Exploratory data analysis", lessonNumber: 6 },
    ],
  },
  {
    title: "Docker and Kubernetes",
    shortDescription: "Containerize apps and orchestrate with Kubernetes",
    description:
      "Learn containerization from the ground up. Master Docker for building, shipping, and running applications. Then scale with Kubernetes — pods, services, deployments, and ingress. Includes real-world deployment strategies.",
    duration: "6 weeks",
    price: 5999,
    keywords: "docker,kubernetes,devops,containers,infrastructure",
    status: CourseStatus.PUBLISHED,
    categorySlug: "devops",
    lessons: [
      { title: "What is Docker?", description: "Containers vs VMs", lessonNumber: 1 },
      { title: "Docker Basics", description: "Images, containers, and Dockerfile", lessonNumber: 2 },
      { title: "Docker Compose", description: "Multi-container apps", lessonNumber: 3 },
      { title: "Kubernetes Intro", description: "Architecture and concepts", lessonNumber: 4 },
      { title: "Deploying to K8s", description: "Pods, services, deployments", lessonNumber: 5 },
      { title: "Production Ready", description: "Ingress, secrets, and scaling", lessonNumber: 6 },
    ],
  },
  {
    title: "UI/UX Design Principles",
    shortDescription: "Design beautiful interfaces with Figma and design thinking",
    description:
      "Learn the fundamentals of UI/UX design. Understand user research, wireframing, prototyping, and visual design. Get hands-on with Figma and build a portfolio-worthy project from scratch.",
    duration: "4 weeks",
    price: 1999,
    keywords: "ui,ux,design,figma,prototyping",
    status: CourseStatus.DRAFT,
    categorySlug: "ui-ux-design",
    lessons: [
      { title: "Design Thinking", description: "User-centered approach", lessonNumber: 1 },
      { title: "Wireframing", description: "Low-fidelity sketches", lessonNumber: 2 },
      { title: "Visual Design", description: "Color, typography, and layout", lessonNumber: 3 },
      { title: "Prototyping in Figma", description: "Interactive prototypes", lessonNumber: 4 },
    ],
  },
];

const STUDENTS = [
  { name: "Ram Sharma", email: "ram@student.com" },
  { name: "Sita Thapa", email: "sita@student.com" },
  { name: "Hari Poudel", email: "hari@student.com" },
  { name: "Gita Rai", email: "gita@student.com" },
  { name: "Krishna Tamang", email: "krishna@student.com" },
  { name: "Sunita Gurung", email: "sunita@student.com" },
  { name: "Bikash Magar", email: "bikash@student.com" },
  { name: "Anita Shrestha", email: "anita@student.com" },
];

const WHATSAPP_NUMBERS = [
  "9779841234567",
  "9779851234567",
  "9779861234567",
  "9779871234567",
  "9779841234568",
  "9779851234568",
  "9779861234568",
  "9779871234568",
];

// ── Main Seed ────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data (order matters for foreign keys)
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned existing data");

  // ── 1. Users ─────────────────────────────────────────────────────────

  const password = await hashPassword("password123");

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@bisanlms.com",
      emailVerified: true,
      role: "admin",
      accounts: {
        create: {
          accountId: "admin@bisanlms.com",
          providerId: "email",
          password,
        },
      },
    },
  });

  const instructor = await prisma.user.create({
    data: {
      name: "Instructor",
      email: "instructor@bisanlms.com",
      emailVerified: true,
      role: "instructor",
      accounts: {
        create: {
          accountId: "instructor@bisanlms.com",
          providerId: "email",
          password,
        },
      },
    },
  });

  const students = await Promise.all(
    STUDENTS.map((s, i) =>
      prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          emailVerified: true,
          role: "student",
          accounts: {
            create: {
              accountId: s.email,
              providerId: "email",
              password,
            },
          },
        },
      })
    )
  );

  console.log(`✅ Created admin (${admin.email}), instructor (${instructor.email}), and ${students.length} students`);
  console.log("   All passwords: password123");

  // ── 2. Categories ────────────────────────────────────────────────────

  const categoryMap = new Map<string, string>(); // slug -> id

  for (const cat of CATEGORIES) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryMap.set(cat.slug, parent.id);

    if (cat.children) {
      for (const child of cat.children) {
        const childCat = await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parent.id,
          },
        });
        categoryMap.set(child.slug, childCat.id);
      }
    }
  }

  console.log(`✅ Created ${categoryMap.size} categories`);

  // ── 3. Courses ───────────────────────────────────────────────────────

  const courseIds: string[] = [];

  for (const courseData of COURSES) {
    const categoryId = categoryMap.get(courseData.categorySlug);
    if (!categoryId) {
      console.log(`⚠️  Skipping "${courseData.title}" — category "${courseData.categorySlug}" not found`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: slugify(courseData.title),
        shortDescription: courseData.shortDescription,
        description: courseData.description,
        duration: courseData.duration,
        price: courseData.price,
        keywords: courseData.keywords,
        status: courseData.status,
        categories: {
          create: [{ categoryId }],
        },
        lessons: {
          create: courseData.lessons.map((l) => ({
            title: l.title,
            description: l.description,
            videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
            lessonNumber: l.lessonNumber,
          })),
        },
      },
    });

    courseIds.push(course.id);
  }

  console.log(`✅ Created ${courseIds.length} courses with lessons`);

  // ── 4. Enrollments & Payments ────────────────────────────────────────

  const statuses = [
    EnrollmentStatus.Approved,
    EnrollmentStatus.Approved,
    EnrollmentStatus.Approved,
    EnrollmentStatus.Pending,
    EnrollmentStatus.Rejected,
  ];

  let enrollmentCount = 0;
  let paymentCount = 0;

  for (const student of students) {
    // Each student enrolls in 1–3 random courses
    const numEnrollments = randomInt(1, 3);
    const enrolledCourses = new Set<string>();

    for (let i = 0; i < numEnrollments; i++) {
      const courseId = randomItem(courseIds);
      if (enrolledCourses.has(courseId)) continue;
      enrolledCourses.add(courseId);

      const status = randomItem(statuses);
      const enrolledDaysAgo = randomInt(1, 60);

      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId,
          enrolledAt: new Date(Date.now() - enrolledDaysAgo * 86400000),
          enrollmentStatus: status,
          whatsapp: randomItem(WHATSAPP_NUMBERS),
        },
      });

      enrollmentCount++;

      // Create payment for approved enrollments
      if (status === EnrollmentStatus.Approved) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        await prisma.payment.create({
          data: {
            enrollmentId: enrollment.id,
            amount: Number(course?.price ?? 0),
            status: PaymentStatus.Completed,
            paymentMethod: randomItem([PaymentMethod.khalti, PaymentMethod.esewa]),
            transactionId: `TXN-${Date.now()}-${randomInt(1000, 9999)}`,
            pidx: `pidx-${Date.now()}-${randomInt(1000, 9999)}`,
          },
        });
        paymentCount++;
      }

      // Create pending payment for pending enrollments
      if (status === EnrollmentStatus.Pending) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        await prisma.payment.create({
          data: {
            enrollmentId: enrollment.id,
            amount: Number(course?.price ?? 0),
            status: PaymentStatus.Pending,
            paymentMethod: PaymentMethod.khalti,
            pidx: `pidx-${Date.now()}-${randomInt(1000, 9999)}`,
          },
        });
        paymentCount++;
      }
    }
  }

  console.log(`✅ Created ${enrollmentCount} enrollments and ${paymentCount} payments`);

  // ── Summary ──────────────────────────────────────────────────────────

  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    courses: await prisma.course.count(),
    lessons: await prisma.lesson.count(),
    enrollments: await prisma.enrollment.count(),
    payments: await prisma.payment.count(),
  };

  console.log("\n📊 Seed Summary:");
  console.log(`   Users:       ${counts.users}`);
  console.log(`   Categories:  ${counts.categories}`);
  console.log(`   Courses:     ${counts.courses}`);
  console.log(`   Lessons:     ${counts.lessons}`);
  console.log(`   Enrollments: ${counts.enrollments}`);
  console.log(`   Payments:    ${counts.payments}`);

  console.log("\n🔐 Login Credentials:");
  console.log("   Admin:  admin@bisanlms.com / password123");
  console.log("   Instructor: instructor@bisanlms.com / password123");
  console.log("   Students: ram@student.com, sita@student.com, etc. / password123");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
