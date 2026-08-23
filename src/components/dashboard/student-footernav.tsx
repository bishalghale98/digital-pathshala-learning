'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { Home, BookOpen, GraduationCap, Settings } from 'lucide-react'

const navItems = [
  { href: ROUTES.STUDENT_DASHBOARD, label: 'Home', icon: Home },
  { href: ROUTES.STUDENT_MY_COURSES, label: 'My Courses', icon: GraduationCap },
  { href: ROUTES.STUDENT_COURSES, label: 'Courses', icon: BookOpen },
  { href: ROUTES.STUDENT_SETTINGS, label: 'Settings', icon: Settings },
]

const StudentFooterNav = () => {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === ROUTES.STUDENT_DASHBOARD
              ? pathname === ROUTES.STUDENT_DASHBOARD
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default StudentFooterNav
