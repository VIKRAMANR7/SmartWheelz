import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Car from "../models/Car.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function generateToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return res.json({ success: true, message: "User registered successfully", token });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Incorrect password" });
  }

  const token = generateToken(user._id.toString());

  return res.json({ success: true, message: "User logged in successfully", token });
});

export const getUserData = asyncHandler(async (req: Request, res: Response) => {
  return res.json({ success: true, message: "User data fetched successfully", user: req.user });
});

export const getCars = asyncHandler(async (_req: Request, res: Response) => {
  const cars = await Car.find({ isAvailable: true });

  return res.json({ success: true, message: "Cars fetched successfully", cars });
});
