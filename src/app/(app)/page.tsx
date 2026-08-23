import type { Metadata } from 'next';
import HomePage from '@/components/public/home/home-page';

export const metadata: Metadata = {
  title: 'BISAN LMS - Online Learning Platform',
  description:
    'Learn practical skills through structured online courses. BISAN LMS helps you track progress, explore categories, and grow your knowledge at your own pace.',
  openGraph: {
    title: 'BISAN LMS - Online Learning Platform',
    description:
      'Learn practical skills through structured online courses. Track progress and grow your knowledge.',
    type: 'website',
  },
};

export default function HomeRoute() {
  return <HomePage />;
}
