// src/validators/enquiryValidator.ts
import { z } from "zod";

export const createEnquirySchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().length(10, "Phone is required"),
  message: z.string().min(5, "Message cannot be empty or less than 5 characters"),
  status: z.enum(["open", "in-progress", "closed"]).optional(),
  assignedTo: z.string().nullable().optional(), // userId
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
