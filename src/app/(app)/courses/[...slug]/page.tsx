import { RichTextContent } from "@/components/editor";
import { prisma } from "@/database/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const getCourseDetailBySlug = async (slug: string) => {
    const course = await prisma.course.findUnique({
        where: { slug },
        include: {
            categories: {
                include: {
                    category: true,
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

            ...(course.thumbnail && {
                images: [
                    {
                        url: course.thumbnail,
                        alt: course.title,
                    },
                ],
            }),
        },

        twitter: {
            card: "summary_large_image",
            title: course.title,
            description,

            ...(course.thumbnail && {
                images: [course.thumbnail],
            }),
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
        <div>
            <h1>{course.title}</h1>

            <RichTextContent content={course.description} />
        </div>
    );
};

export default CourseDetail;