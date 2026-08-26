'use client'

import { DashboardLayout } from './dashboard-layout'
import SidebarContent from './student-sidebar';

const StudentDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout sidebarContent={SidebarContent} avatarFallbackColor="bg-gray-200">
      {children}
    </DashboardLayout>
  )
}

export default StudentDashboard
