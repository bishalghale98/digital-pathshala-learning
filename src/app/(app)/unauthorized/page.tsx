import Link from "next/link";
import { ROUTES } from "@/lib/constants";

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
                    <svg
                        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Return to safety
                </Link>
            </div>
        </div>
    )
}