import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
