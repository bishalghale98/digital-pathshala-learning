"use client";

import { useEffect, useState } from "react";
import { useGetPaymentDetailQuery } from "@/store/payment/paymentApi";
import { X, Loader2, CheckCircle, Clock, AlertCircle, CreditCard, Receipt, User } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedId: string;
}

const PaymentModal = ({ isOpen, onClose, selectedId }: Props) => {
    const { data: payment, isLoading: loading } = useGetPaymentDetailQuery(selectedId, {
        skip: !isOpen || !selectedId,
    });
    const [closing, setClosing] = useState(false);

    // Handle smooth modal close with animation
    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            onClose();
        }, 200);
    };

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    if (!isOpen) return null;

    // Status icon mapping
    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "pending":
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case "failed":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    // Status badge styles
    const getStatusBadgeStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-50 text-green-700 border-green-200";
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "failed":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NP", {
            style: "currency",
            currency: "NPR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            {/* Backdrop with fade animation */}
            <div
                className={`fixed inset-0 z-50 transition-all duration-200 ${closing ? "bg-black/0" : "bg-black/60"}`}
                onClick={handleClose}
            >
                {/* Modal container with slide-up animation */}
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-linear-to-r from-gray-900 to-gray-800 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Receipt className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Payment Details</h2>
                                        <p className="text-gray-300 text-sm">Transaction information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {/* Loading State */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent blur-sm"></div>
                                    </div>
                                    <p className="text-gray-600">Loading payment details...</p>
                                    <p className="text-sm text-gray-500">Please wait a moment</p>
                                </div>
                            )}

                            {/* Error/Empty State */}
                            {!loading && !payment && (
                                <div className="text-center py-12 space-y-4">
                                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Payment Not Found
                                        </h3>
                                        <p className="text-gray-600">
                                            Unable to retrieve payment details. Please try again.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Details */}
                            {!loading && payment && (
                                <div className="space-y-6">
                                    {/* Status Card */}
                                    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                {getStatusIcon(payment.status)}
                                                <div>
                                                    <p className="text-sm text-gray-600">Status</p>
                                                    <p className="font-semibold text-gray-900">{payment.status}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeStyle(
                                                    payment.status
                                                )}`}
                                            >
                                                {payment.status}
                                            </span>
                                        </div>
                                        <div className="text-center py-4">
                                            <p className="text-3xl font-bold text-gray-900">
                                                {formatCurrency(payment.amount)}
                                            </p>
                                            <p className="text-gray-600 text-sm mt-1">Total Amount Paid</p>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                                            <CreditCard className="w-5 h-5 text-gray-500" />
                                            <span>Payment Information</span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">Payment Method</p>
                                                <p className="font-medium capitalize">{payment.paymentMethod}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">Transaction ID</p>
                                                <p className="font-medium font-mono text-sm truncate" title={payment.transactionId}>
                                                    {payment.transactionId || "—"}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">PIDX</p>
                                                <p className="font-medium font-mono text-sm truncate" title={payment.pidx}>
                                                    {payment.pidx}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">Payment Date</p>
                                                <p className="font-medium">
                                                    {formatDate(payment.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enrollment Information */}
                                    {payment.enrollment && (
                                        <div className="border-t pt-6 space-y-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                                                <User className="w-5 h-5 text-gray-500" />
                                                <span>Enrollment Details</span>
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">WhatsApp</span>
                                                    <span className="font-medium">{payment.enrollment.whatsapp}</span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Enrollment Status</span>
                                                    <span className="font-medium capitalize">
                                                        {payment.enrollment.enrollmentStatus?.toLowerCase()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Enrollment Date</span>
                                                    <span className="font-medium">
                                                        {formatDate(payment.enrollment.enrolledAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="border-t pt-6">
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    // Copy payment ID to clipboard
                                                    navigator.clipboard.writeText(payment._id);
                                                    // Add toast notification here
                                                }}
                                                className="flex-1 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                            >
                                                Copy Payment ID
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Generate and download receipt
                                                    // Implement receipt generation logic
                                                }}
                                                className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                            >
                                                Download Receipt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-gray-50 p-4">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentModal;