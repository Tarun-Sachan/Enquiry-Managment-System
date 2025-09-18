import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

// Protect all routes: only admin
router.use(authenticate, authorize("admin"));

// CRUD routes
router.get("/", getUsers);            // GET /users
router.post("/", createUser);         // POST /users
router.put("/:id", updateUser);       // PUT /users/:id
router.delete("/:id", deleteUser);    // DELETE /users/:id

export default router;
