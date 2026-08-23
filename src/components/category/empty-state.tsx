import { ClipboardList } from 'lucide-react'

interface EmptyStateProps {
    openAddModal: () => void
}


const EmptyState: React.FC<EmptyStateProps> = ({ openAddModal }) => (
    <tr>
        <td colSpan={5} className="p-8 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
                <ClipboardList className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No categories found</p>
                <p className="text-sm mb-4">Get started by adding your first category</p>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Category
                </button>
            </div>
        </td>
    </tr>
)

export default EmptyState