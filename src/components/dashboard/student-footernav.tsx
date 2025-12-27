'use client'

import React from 'react'
import Link from 'next/link'
import { Home, BookOpen, ClipboardList } from 'lucide-react'

const StudentFooterNav = () => {
    const navItems = [
        { href: '/student', label: 'Dashboard', icon: <Home size={20} /> },
        { href: '/student/courses', label: 'Courses', icon: <BookOpen size={20} /> },
        { href: '/student/mycourse', label: 'My Courses', icon: <ClipboardList size={20} /> },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        {item.icon}
                        <span className="text-xs font-medium mt-1">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default StudentFooterNav
