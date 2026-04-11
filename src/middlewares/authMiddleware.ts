import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided." });

  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === "string") {
    return res.status(401).json({ message: "Invalid token" });
  }
  (req as any).email = decoded.email;
  (req as any).role = decoded.role;
  next();
};
