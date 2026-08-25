import { prisma } from "@/database/prisma";
import { CourseStatus, Prisma } from "@prisma/client";
import { cache } from "react";


export type PublicCourse = Prisma.CourseGetPayload<{
    omit: {
        whatsappGroupLink: true;
        status: true,
    };
    include: {
        categories: {
            include: {
                category: true;
            };
        };
    };
}>;

export const getCourses = cache(async () => {
    return prisma.course.findMany({
        where: {
            status: CourseStatus.PUBLISHED,
        },
        omit: {
            whatsappGroupLink: true,
            status: true,
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
});


export const getCourseDetailBySlug = cache(async (slug: string) => {
    return prisma.course.findUnique({
        where: { slug, status: CourseStatus.PUBLISHED },
        omit: {
            whatsappGroupLink: true,
            status: true,
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
});


