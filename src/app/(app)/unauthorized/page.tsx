import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: 'Unauthorized',
  description: 'You do not have permission to access this resource.',
};

export default function MinimalUnauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-900">
            <div className="text-center">
                {/* Title */}
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                    Hold Up!
                </h1>

                {/* Error Code */}
                <div className="relative inline-block mb-8">
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-500">
                        401
                    </div>
                    <div className="absolute -inset-1 bg-linear-to-r from-red-500 to-pink-500 blur opacity-20 rounded-lg"></div>
                </div>

                {/* Message */}
                <div className="bg-gray-800 border-l-4 border-red-500 p-6 rounded-r-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Unauthorized
                    </h2>
                    <p className="text-gray-400">
                        You don&apos;t have the necessary permissions to access this resource.
                    </p>
                </div>

                {/* Divider */}
                <div className="my-8">
                    <div className="h-px w-48 mx-auto bg-linear-to-r from-transparent via-gray-600 to-transparent"></div>
                </div>

                <Link
                    href={ROUTES.HOME}
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Return to safety
                </Link>
            </div>
        </div>
    )
}