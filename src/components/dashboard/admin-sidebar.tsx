'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
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
import Image from 'next/image';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { href: '/admin/students', label: 'Students', icon: Users },
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/categories', label: 'Categories', icon: Tag },
      { href: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
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
    router.push('/sign-in')
  }

  const handleNav = () => {
    onNavigate?.()
  }

  return (
    <>
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <Link href="/admin" className="text-lg font-bold text-gray-900 tracking-tight" onClick={handleNav}>
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
                  item.href === '/admin'
                    ? pathname === '/admin'
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
          {session?.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Admin'}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(session?.user.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
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

const AdminSidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <SidebarContent />
    </div>
  )
}

export default AdminSidebar
