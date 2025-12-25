import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getInputClass } from "@/lib/utils/form";
import { enrollmentCreateSchema } from "@/schemas/enrollmentSchema";
import { PaymentMethod } from "@/types/models";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createEnrollment } from "@/store/enrollment/enrollmentSlice";

interface EnrollModalProps {
    closeModal: () => void;
    courseId: string;
}

type EnrollFormValues = z.infer<typeof enrollmentCreateSchema>;

const EnrollModal: React.FC<EnrollModalProps> = ({ closeModal, courseId }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const disptach = useAppDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EnrollFormValues>({
        resolver: zodResolver(enrollmentCreateSchema),
        defaultValues: {
            courseId,
            whatsApp: "",
            paymentMethod: PaymentMethod.Khalti,
        },
    });

    const onSubmit = async (data: EnrollFormValues) => {
        console.log("Enroll Data:", data);
        disptach(createEnrollment(data))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                onClick={closeModal}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-linear-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Enroll in Course</h2>
                    <button onClick={closeModal} className="text-white/60 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* STEP 1 */}
                {!isConfirmed ? (
                    <div className="px-6 py-5 space-y-4">
                        <p className="text-sm text-white/70">
                            Confirm your enrollment. Once enrolled, you’ll get full access.
                        </p>

                        <ul className="space-y-2 text-sm text-white/80">
                            <li>✔ Lifetime access</li>
                            <li>✔ Certificate after completion</li>
                            <li>✔ Student dashboard access</li>
                        </ul>

                        <div className="flex gap-3 pt-6">
                            <button
                                onClick={closeModal}
                                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => setIsConfirmed(true)}
                                className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                ) : (
                    /* STEP 2 */
                    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
                        <p className="text-sm text-white/70">
                            Enter your WhatsApp number and choose payment method.
                        </p>

                        {/* WhatsApp */}
                        <div>
                            <label className="block mb-2 text-sm text-white">
                                WhatsApp No. *
                            </label>
                            <input
                                {...register("whatsApp")}
                                className={getInputClass(!!errors.whatsApp, "text-white")}
                                placeholder="98XXXXXXXX"
                            />
                            {errors.whatsApp && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.whatsApp.message}
                                </p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block mb-2 text-sm text-white">
                                Payment Method *
                            </label>
                            <select
                                {...register("paymentMethod")}
                                className={getInputClass(!!errors.paymentMethod)}
                            >
                                <option value={PaymentMethod.Khalti}>Khalti</option>
                                <option value={PaymentMethod.Esewa}>eSewa</option>
                            </select>

                            {errors.paymentMethod && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl bg-[#7127BA] hover:bg-[#8b3eea] text-white font-semibold text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : "Enroll & Pay"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EnrollModal;
