// controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../models/users";
import bcrypt from "bcryptjs";

// GET /users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({role:"user"}, "-passwordHash"); // hide password
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, role });
    res.status(201).json({ ...user.toObject(), passwordHash: undefined });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
