import type { Metadata } from 'next';
import SignInPage from '@/components/public/sign-in/sign-in-page';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your BISAN LMS account. Continue with Google for secure, one-click access.',
  openGraph: {
    title: 'Sign In | BISAN LMS',
    description: 'Sign in to your BISAN LMS account.',
    type: 'website',
  },
};

export default function SignInRoute() {
  return <SignInPage />;
}
