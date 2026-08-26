'use client'

import { DashboardLayout } from './dashboard-layout'
import { SidebarContent } from './admin-sidebar'

const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout sidebarContent={SidebarContent} avatarFallbackColor="bg-gray-900">
      {children}
    </DashboardLayout>
  )
}

export default AdminDashboard
