import React from 'react'

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
