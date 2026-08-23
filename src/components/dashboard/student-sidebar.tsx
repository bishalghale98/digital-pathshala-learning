'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: ROUTES.STUDENT_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.STUDENT_MY_COURSES, label: 'My Courses', icon: GraduationCap },
  { href: ROUTES.STUDENT_COURSES, label: 'Courses', icon: BookOpen },
  { href: ROUTES.STUDENT_SETTINGS, label: 'Settings', icon: Settings },
]

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push(ROUTES.SIGN_IN)
  }

  const handleNav = () => {
    onNavigate?.()
  }

  return (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <Link href={ROUTES.STUDENT_DASHBOARD} className="text-xl font-bold text-gray-900" onClick={handleNav}>
          BISAN LMS
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
              onClick={handleNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          {session?.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'Student'}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {(session?.user.name || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user.name || 'Student'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  )
}

const StudentSidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <SidebarContent />
    </div>
  )
}

export { SidebarContent }
export default StudentSidebar
