import { z } from "zod";

export const enquirySchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(1, "Message is required"),
  status: z.enum(["open", "in-progress", "closed"]).default("open"),
  assignedTo: z.string().optional(), // user ID (ObjectId)
});

export const updateEnquirySchema = enquirySchema.partial(); // all optional for update
