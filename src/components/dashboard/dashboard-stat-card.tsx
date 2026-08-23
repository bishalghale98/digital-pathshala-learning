import React from 'react'

interface DashboardStatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default DashboardStatCard
