'use client'

import React from 'react'
import { authClient } from '@/lib/auth-client'
import { PageHeader } from '@/components/common/page-header'
import { Avatar } from '@/components/common/avatar'
import { InfoRow } from '@/components/common/info-row'
import { Mail, User, Shield, Calendar } from 'lucide-react'

const AdminSettingsPage = () => {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account settings" />

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Your account information</p>
        </div>

        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar src={user?.image} name={user?.name} size="lg" className="bg-gray-900 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || 'Admin'}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-4">
            <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={user?.name || '—'} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user?.email || '—'} />
            <InfoRow icon={<Shield className="w-4 h-4" />} label="Role" value={user?.role || 'admin'} />
            <InfoRow icon={<Calendar className="w-4 h-4" />} label="Status" value="Active" />
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

export default AdminSettingsPage
