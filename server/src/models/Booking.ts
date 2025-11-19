import mongoose, { Schema, Types } from "mongoose";

export interface IBooking {
  car: Types.ObjectId;
  user: Types.ObjectId;
  owner: Types.ObjectId;
  pickupDate: Date;
  returnDate: Date;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
}

const bookingSchema = new Schema<IBooking>(
  {
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
