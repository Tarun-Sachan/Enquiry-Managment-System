import { Router } from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = Router();

// All routes need authentication
router.use(authenticate);

// User only
router.post("/", authorize("user"), createEnquiry); // POST /enquiries

// Common: user + admin
router.get("/", authorize("user", "admin"), getEnquiries);      // GET /enquiries
router.get("/:id", authorize("user", "admin"), getEnquiryById); // GET /enquiries/:id
router.put("/:id", authorize("user", "admin"), updateEnquiry);  // PUT /enquiries/:id
router.delete("/:id", authorize("user", "admin"), deleteEnquiry); // DELETE /enquiries/:id

export default router;
