import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import api from "@/config/api";
import { PaymentState } from "./types";

const initialState: PaymentState = {
  payment: null,
  loading: false,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setPayment(state, action) {
      state.payment = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearPayment(state) {
      state.payment = null;
    },
  },
});

export const { setPayment, setLoading, clearPayment } = paymentSlice.actions;

export default paymentSlice.reducer;

// ✅ THUNK
export function fetchPayment(enrollmentId: string) {
  return async function fetchPaymentThunk(dispatch: AppDispatch) {
    try {
      dispatch(setLoading(true));
      dispatch(clearPayment());

      const res = await api.get(`/payment?enrollmentId=${enrollmentId}`);
      console.log(res.data.data);

      if (res.data?.data) {
        dispatch(setPayment(res.data.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
