import { IPayment, Status } from "@/types/mongoose";
import { model, models, Schema } from "mongoose";

const paymentSchema = new Schema<IPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
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
  },
  {
    timestamps: true,
  }
);

const Payment = models.Payment || model<IPayment>("Payment", paymentSchema);

export default Payment;
