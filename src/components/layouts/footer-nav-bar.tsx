'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FaHome, FaInfoCircle, FaTachometerAlt } from 'react-icons/fa';

const FooterNavBar = () => {
    const pathname = usePathname();
    const { data: session } = authClient.useSession();
    const role = session?.user.role;

    const navLinks = [
        { name: 'Home', href: '/', icon: <FaHome size={20} /> },
        { name: 'About Us', href: '/about-us', icon: <FaInfoCircle size={20} /> },
        { name: 'Dashboard', href: `/${role || 'student'}`, icon: <FaTachometerAlt size={20} /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
            <div className="flex items-center justify-around py-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                                }`}
                        >
                            <div className="mb-1">{link.icon}</div>
                            <span className="text-xs font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default FooterNavBar;
