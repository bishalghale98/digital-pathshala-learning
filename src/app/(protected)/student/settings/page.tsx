'use client'

import React from 'react'
import { authClient } from '@/lib/auth-client'
import { PageHeader } from '@/components/common/page-header'
import { Avatar } from '@/components/common/avatar'
import { InfoRow } from '@/components/common/info-row'
import { Mail, User, Shield, Calendar } from 'lucide-react'

const StudentSettingsPage = () => {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account settings and preferences." />

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Your account information</p>
        </div>

        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar src={user?.image} name={user?.name} size="lg" className="bg-gray-100 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || 'Student'}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-4">
            <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={user?.name || '—'} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user?.email || '—'} />
            <InfoRow icon={<Shield className="w-4 h-4" />} label="Role" value={user?.role || 'student'} />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Member Since"
              value={session?.user?.id ? 'Active member' : '—'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentSettingsPage
