import React from 'react'
import type { StatCardProps } from '@/components/dashboard/types'
import { cn } from '@/lib/utils'

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
}

interface StatCardPropsExtended extends StatCardProps {
  onClick?: () => void
  active?: boolean
}

export function StatCard({ title, value, icon, color, onClick, active }: StatCardPropsExtended) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border p-5 text-left transition-colors w-full',
        onClick && 'cursor-pointer hover:bg-gray-50',
        active ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={cn('w-11 h-11 rounded-lg flex items-center justify-center', colorMap[color])}>
          {icon}
        </div>
      </div>
    </Wrapper>
  )
}
