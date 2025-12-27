'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const NavBar = () => {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();

    const role = session?.user.role
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About us', href: '/about-us' },
        { name: 'Dashboard', href: `${role}` },
    ];

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        BISAN LMS
                    </Link>

                    {/* Desktop nav links */}
                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-gray-700 hover:text-blue-600 font-medium ${pathname === link.href ? 'text-blue-600' : ''
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth buttons */}
                    <div className="hidden md:flex items-center space-x-4 ">
                        {session?.user ? (
                            <button
                                onClick={() => authClient.signOut()}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => authClient.signIn.social({ provider: 'google' })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden">
                        {/* You can add a hamburger menu here later */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
