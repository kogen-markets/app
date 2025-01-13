import { Request, Response } from "express";
import Joi from "joi";
import { generateToken } from "../services/authService";

// Validation schema for login request
const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

export const signIn = async (req: Request, res: Response) => {
  // Validate incoming request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid input", details: error.details });
  }

  const { username, password } = req.body;

  // Dummy authentication logic (replace with actual authentication logic)
  if (username === "admin" && password === "password") {
    // Generate a token for the authenticated user
    const token = generateToken(username); // Generate token using the username (or user ID)

    return res.status(200).json({ message: "Login successful", token });
  }

  // Invalid credentials
  return res.status(401).json({ message: "Invalid credentials" });
};
