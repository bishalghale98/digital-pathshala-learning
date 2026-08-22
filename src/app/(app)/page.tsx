'use client'

import { useRouter } from 'next/navigation';
import { authClient } from '../../lib/auth-client';
import React from 'react';
import { getDashboardPath } from '@/lib/dashboard';

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter()

  const handleRoute = () => {
    router.push(getDashboardPath(session?.user.role))
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            You are logged in. Go to your dashboard to start learning.
          </p>
          <button
            onClick={() => handleRoute()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex items-center justify-center h-screen bg-linear-to-r from-blue-400 to-purple-500">
      <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to BISAN LMS
        </h1>
        <p className="text-gray-600 mb-6">
          Learn courses, track progress, and join the community.
        </p>
        <button
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
            });
          }}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full"
        >

          Sign In with Google
        </button>
      </div>
    </div>
  );
}
