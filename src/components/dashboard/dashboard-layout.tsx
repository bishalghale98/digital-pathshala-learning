'use client'

import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Menu, X } from 'lucide-react'
import { Avatar } from '@/components/common/avatar'

interface SidebarContentProps {
  onNavigate?: () => void
}

interface DashboardLayoutProps {
  sidebarContent: React.ComponentType<SidebarContentProps>
  children: React.ReactNode
  avatarFallbackColor?: string
}

export function DashboardLayout({ sidebarContent: SidebarContent, children, avatarFallbackColor = 'bg-gray-200' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = authClient.useSession()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl flex flex-col">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src={session?.user.image}
              name={session?.user.name}
              size="sm"
              className={avatarFallbackColor}
            />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
