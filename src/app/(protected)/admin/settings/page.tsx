'use client'

import React from 'react'
import { authClient } from '@/lib/auth-client'
import { Mail, User, Shield, Calendar } from 'lucide-react'

const AdminSettingsPage = () => {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Your account information</p>
        </div>

        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || 'Admin'}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center border-2 border-gray-200">
                <span className="text-xl font-bold text-white">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || 'Admin'}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-4">
            <InfoRow
              icon={<User className="w-4 h-4" />}
              label="Name"
              value={user?.name || '—'}
            />
            <InfoRow
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={user?.email || '—'}
            />
            <InfoRow
              icon={<Shield className="w-4 h-4" />}
              label="Role"
              value={user?.role || 'admin'}
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Status"
              value="Active"
            />
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Platform</h2>
          <p className="text-sm text-gray-500 mt-1">LMS configuration</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <InfoRow icon={<Shield className="w-4 h-4" />} label="Platform" value="BISAN LMS" />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Version" value="1.0.0" />
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3 text-sm text-gray-500">
      {icon}
      {label}
    </div>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
)

export default AdminSettingsPage
