

interface EmptyStateProps {
    openAddModal: () => void
}


const EmptyState: React.FC<EmptyStateProps> = ({ openAddModal }) => (
    <tr>
        <td colSpan={5} className="p-8 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
                <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
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