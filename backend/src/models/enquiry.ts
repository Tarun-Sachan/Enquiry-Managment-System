import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: "open" | "in-progress" | "closed";
  assignedTo?: mongoose.Types.ObjectId; // reference to User
  createdBy: mongoose.Types.ObjectId; 
  deleted: boolean;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IEnquiry>("Enquiry", enquirySchema);
