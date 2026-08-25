import type { Metadata } from 'next';
import CoursesPage from '@/components/public/courses/courses-page';
import { getCourses } from '@/lib/queries/course';



export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Explore our full catalog of courses. Find the right course to build practical skills and grow your knowledge.',
  openGraph: {
    title: 'Courses | BISAN LMS',
    description:
      'Explore our full catalog of courses. Find the right course to build practical skills.',
    type: 'website',
  },
};

export default async function CoursesRoute() {

  const courses = await getCourses();



  return <CoursesPage courses={JSON.parse(JSON.stringify(courses))} />;
}
