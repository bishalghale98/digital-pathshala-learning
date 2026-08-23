'use client'

import { authClient } from '@/lib/auth-client';
import React from 'react'
import { FcGoogle } from 'react-icons/fc'


const SignIn = () => {




  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      {/* Logo/Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
          <span className="text-2xl font-bold text-white">G</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 text-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-600 mt-1">with your Google account</p>
        </div>

        {/* Card Content */}
        <div className="p-8">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-lg text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="text-lg">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>



          {/* Terms & Privacy */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have a Google account?{' '}
              <a
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center max-w-md">
        <div className="flex items-center justify-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">One-click</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          We use Google&apos;s secure authentication system. Your data is protected with industry-leading encryption.
        </p>
      </div>
    </div>
  )
}

export default SignIn
