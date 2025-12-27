import { IEnrollment } from "../enrollment/types";

export interface IPayment {
  _id: string;
  enrollment: IEnrollment;
  amount: number;
  status: string;
  paymentMethod: string;
  pidx: string;
  transactionId: string;
  createdAt: string;
}

export interface PaymentState {
  payment: IPayment | null;
  loading: boolean;
}
