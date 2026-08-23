'use client'

import React, { useState } from 'react'
import StudentSidebar, { SidebarContent } from './student-sidebar'
import { authClient } from '@/lib/auth-client'
import { Menu, X } from 'lucide-react'

const StudentDashboard = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = authClient.useSession()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <StudentSidebar />

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
            {session?.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'Student'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {(session?.user.name || 'S').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
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

export default StudentDashboard
