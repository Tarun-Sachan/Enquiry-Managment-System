import { Request, Response } from "express";
import Enquiry from "../models/enquiry";
import { enquirySchema, updateEnquirySchema } from "../schemas/enquirySchema";

// ✅ Create enquiry (user only)
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const parsed = enquirySchema.parse(req.body);

    const enquiry = await Enquiry.create({
      ...parsed,
      createdBy: (req as any).user.id, // logged-in user from JWT
    });

    res.status(201).json(enquiry);
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({ errors: err.errors }); // Zod validation errors
    }
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all enquiries (filters + RBAC)
export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const filters: any = { deleted: false };

    // Restrict normal users to their own enquiries
    if ((req as any).user.role === "user") {
      filters.createdBy = (req as any).user.id;
    }

    if (req.query.status) filters.status = req.query.status;
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

    const enquiries = await Enquiry.find(filters)
      .populate("assignedTo", "name email ")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single enquiry (RBAC)
export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const filters: any = { _id: req.params.id, deleted: false };

    if ((req as any).user.role === "user") {
      filters.createdBy = (req as any).user.id;
    }

    const enquiry = await Enquiry.findOne(filters)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update enquiry (RBAC)
export const updateEnquiry = async (req: Request, res: Response) => {
  try {
    const parsed = updateEnquirySchema.parse(req.body);

    const filters: any = { _id: req.params.id, deleted: false };
    if ((req as any).user.role === "user") {
      filters.createdBy = (req as any).user.id;
    }

    const enquiry = await Enquiry.findOneAndUpdate(filters, parsed, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err: any) {
    if (err.errors) return res.status(400).json({ errors: err.errors });
    res.status(500).json({ message: err.message });
  }
};

// ✅ Soft delete enquiry (RBAC)
export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const filters: any = { _id: req.params.id };
    if ((req as any).user.role === "user") {
      filters.createdBy = (req as any).user.id;
    }

    const enquiry = await Enquiry.findOneAndUpdate(filters, { deleted: true }, { new: true });

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
