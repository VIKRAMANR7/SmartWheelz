import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Car from "../models/Car.js";
import User from "../models/User.js";
import { SESSION_KEY } from "../configs/session.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function generateToken(userId: string): string {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.JWT_SECRET + SESSION_KEY, {
    expiresIn: "7d",
  });
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 8) {
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    message: "User registered successfully",
    token,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }

  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    message: "User logged in successfully",
    token,
  });
});

// ---- Get Logged-In User ---- //
export const getUserData = asyncHandler(async (req: Request, res: Response) => {
  const { user } = req;

  res.json({
    success: true,
    message: "User data fetched successfully",
    user,
  });
});

// ---- Get All Available Cars ---- //
export const getCars = asyncHandler(async (_req: Request, res: Response) => {
  const cars = await Car.find({ isAvailable: true });

  res.json({
    success: true,
    message: "Cars fetched successfully",
    cars,
  });
});
