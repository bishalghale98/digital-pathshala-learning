'use client'

import { authClient } from '@/lib/auth-client';
import { signUpSchema, type SignUpInput } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const handleEmailSignUp = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }

      toast.success('Account created successfully');
      window.location.href = '/';
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Sign up to get started with BISAN LMS</p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 text-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-600 mt-1">with your email or Google account</p>
        </div>

        {/* Card Content */}
        <div className="p-8">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(handleEmailSignUp)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-lg text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="text-lg">Continue with Google</span>
          </button>

          {/* Terms & Privacy */}
          <div className="text-center text-gray-500 text-sm mt-6">
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
              Already have an account?{' '}
              <Link
                href={ROUTES.SIGN_IN}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Sign in
              </Link>
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
            <span className="text-sm">Fast</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Create your account in seconds. Start learning with BISAN LMS today.
        </p>
      </div>
    </div>
  )
}

export default SignUp
