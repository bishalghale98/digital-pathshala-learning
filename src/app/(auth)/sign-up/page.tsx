import type { Metadata } from 'next';
import SignUpPage from '@/components/public/sign-in/sign-up-page';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your BISAN LMS account. Sign up with email or Google for secure access to courses.',
  openGraph: {
    title: 'Sign Up | BISAN LMS',
    description: 'Create your BISAN LMS account.',
    type: 'website',
  },
};

export default function SignUpRoute() {
  return <SignUpPage />;
}
