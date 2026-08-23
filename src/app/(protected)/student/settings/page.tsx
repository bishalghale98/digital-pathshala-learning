'use client'

import React from 'react'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'
import { Mail, User, Shield, Calendar } from 'lucide-react'

const StudentSettingsPage = () => {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your account information
          </p>
        </div>

        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Profile'}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || 'Student'}
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
              value={user?.role || 'student'}
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Member Since"
              value={
                session?.user?.id
                  ? 'Active member'
                  : '—'
              }
            />
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

export default StudentSettingsPage
