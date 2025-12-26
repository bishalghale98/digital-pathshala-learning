import { IPayment, PaymentMethod, Status } from "@/types/models";
import { model, models, Schema } from "mongoose";
import "./course.schema";

const paymentSchema = new Schema<IPayment>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [Status.Pending, Status.Completed, Status.Failed],
      default: Status.Pending,
    },
    paymentMethod: {
      type: String,
      enum: [PaymentMethod.Esewa, PaymentMethod.Khalti],
      default: PaymentMethod.Khalti,
    },
    transactionId: {
      type: String,
    },
    pidx: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = models.Payment || model<IPayment>("Payment", paymentSchema);

export default Payment;
