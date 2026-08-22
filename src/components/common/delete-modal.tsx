import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure you want to delete this user?",
    confirmText = "Yes, I'm sure",
    cancelText = "No, cancel",
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal backdrop */}
            <div
                className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4"
                onClick={onClose}
            >
                {/* Modal container */}
                <div
                    className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <div className="flex justify-end p-2">
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Modal content */}
                    <div className="p-6 pt-0 text-center">
                        {/* Warning icon */}
                        <svg
                            className="w-20 h-20 text-red-600 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>

                        {/* Title */}
                        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                            {title}
                        </h3>

                        {/* Action buttons */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleConfirm}
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base px-5 py-2.5 transition-colors"
                            >
                                {confirmText}
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium rounded-lg text-base px-5 py-2.5 transition-colors"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;
