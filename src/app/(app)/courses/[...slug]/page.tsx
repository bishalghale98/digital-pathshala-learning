import CourseDetailPage from "@/components/public/courses/course-detail-page";
import { prisma } from "@/database/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveImageUrl } from "@/lib/storage/url";

const getCourseDetailBySlug = async (slug: string) => {
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            lessons: {
                orderBy: { lessonNumber: "asc" },
                select: {
                    id: true,
                    title: true,
                    lessonNumber: true,
                },
            },
            _count: {
                select: {
                    enrollments: true,
                },
            },
        },
    });

    return course;
};

interface CoursePageProps {
    params: Promise<{
        slug: string[];
    }>;
}

/**
 * Dynamic SEO metadata
 */
export async function generateMetadata({
    params,
}: CoursePageProps): Promise<Metadata> {
    const { slug } = await params;
    const courseSlug = slug.at(-1);

    if (!courseSlug) {
        return {
            title: "Course Not Found",
        };
    }

    const course = await getCourseDetailBySlug(courseSlug);

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The requested course could not be found.",
        };
    }

    const description =
        course.shortDescription ||
        `Learn ${course.title} with our comprehensive online course.`;

    return {
        title: course.title,
        description,

        keywords: [
            ...new Set([
                course.title,
                "online course",
                "learning",

                ...(course.keywords
                    ?.split(",")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean) ?? []),

                ...course.categories.map(
                    (item) => item.category.name
                ),
            ]),

        ],

        openGraph: {
            title: course.title,
            description,
            type: "article",

            ...(() => {
                const thumbnailUrl = resolveImageUrl(course.thumbnail);
                return thumbnailUrl
                    ? {
                        images: [
                            {
                                url: thumbnailUrl,
                                alt: course.title,
                            },
                        ],
                    }
                    : {};
            })(),
        },

        twitter: {
            card: "summary_large_image",
            title: course.title,
            description,

            ...(() => {
                const thumbnailUrl = resolveImageUrl(course.thumbnail);
                return thumbnailUrl
                    ? { images: [thumbnailUrl] }
                    : {};
            })(),
        },

        alternates: {
            canonical: `/courses/${courseSlug}`,
        },
    };
}

const CourseDetail = async ({
    params,
}: CoursePageProps) => {
    const { slug } = await params;

    const courseSlug = slug.at(-1);

    if (!courseSlug) {
        notFound();
    }

    const course = await getCourseDetailBySlug(courseSlug);

    if (!course) {
        notFound();
    }

    return (
        <CourseDetailPage course={JSON.parse(JSON.stringify(course))} />
    );
};

export default CourseDetail;