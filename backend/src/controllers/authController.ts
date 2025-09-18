import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/users";
import { registerSchema, loginSchema } from "../schemas/authSchema";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);

    const user = new User({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: "user",
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    return res.status(400).json({ error: err.errors ?? err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsed.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({ token });
  } catch (err: any) {
    return res.status(400).json({ error: err.errors ?? err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // set by auth middleware
    const foundUser = await User.findById(user.id).select("-passwordHash");
    return res.json(foundUser);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
