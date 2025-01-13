import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

// Extend the Express Request interface
interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Add custom properties as needed
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
    return;
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
