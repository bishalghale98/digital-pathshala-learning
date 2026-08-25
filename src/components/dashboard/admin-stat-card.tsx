import type { StatCardProps } from './types'

const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700'
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color
}) => {
    return (
        <div className="bg-white border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {value}
                </h2>
            </div>

            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}
            >
                {icon}
            </div>
        </div>
    )
}

export default StatCard
