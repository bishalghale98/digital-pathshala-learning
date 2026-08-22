import { baseApi } from "../api/base";

export interface Payment {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  pidx?: string;
  transactionId?: string;
  createdAt: string;
  enrollment?: {
    _id: string;
    whatsapp?: string;
    enrollmentStatus?: string;
    enrolledAt: string;
  };
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentDetail: builder.query<Payment | null, string>({
      query: (enrollmentId) => `payment?enrollmentId=${enrollmentId}`,
      transformResponse: (res: { data: Payment | null }) => res.data,
      providesTags: (_r, _e, enrollmentId) => [{ type: "Payment", id: enrollmentId }],
    }),
    verifyPayment: builder.mutation<unknown, { pidx: string }>({
      query: (body) => ({ url: "payment/verify", method: "POST", body }),
      invalidatesTags: ["Payment", { type: "Enrollment", id: "LIST" }],
    }),
  }),
});

export const { useGetPaymentDetailQuery, useVerifyPaymentMutation } = paymentApi;
