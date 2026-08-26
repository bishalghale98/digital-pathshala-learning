'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { Avatar } from '@/components/common/avatar'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Tag,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: ROUTES.ADMIN_STUDENTS, label: 'Students', icon: Users },
      { href: ROUTES.ADMIN_COURSES, label: 'Courses', icon: BookOpen },
      { href: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: Tag },
      { href: ROUTES.ADMIN_ENROLLMENTS, label: 'Enrollments', icon: ClipboardList },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: ROUTES.ADMIN_ANALYTICS, label: 'Analytics', icon: BarChart3 },
      { href: ROUTES.ADMIN_SETTINGS, label: 'Settings', icon: Settings },
    ],
  },
]

interface SidebarContentProps {
  onNavigate?: () => void
}

export const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
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
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <Link href={ROUTES.ADMIN_DASHBOARD} className="text-lg font-bold text-gray-900 tracking-tight" onClick={handleNav}>
          BISAN LMS
        </Link>
        <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-900 text-white rounded">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === ROUTES.ADMIN_DASHBOARD
                    ? pathname === ROUTES.ADMIN_DASHBOARD
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNav}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={session?.user.image} name={session?.user.name} className="bg-gray-900 text-white" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user.name || 'Admin'}
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

export default SidebarContent
