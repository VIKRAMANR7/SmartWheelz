import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Car from "../models/Car.js";
import User from "../models/User.js";
import { SESSION_KEY } from "../server.js";
import { handleControllerError } from "../utils/handleError.js";

// ---- Helper: Generate JWT Token ---- //
function generateToken(userId: string): string {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.JWT_SECRET + SESSION_KEY, {
    expiresIn: "7d",
  });
}

// ---- Register User ---- //
export async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.json({
        success: false,
        message: "User already exists",
      });
      return;
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
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// ---- Login User ---- //
export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({
        success: false,
        message: "Incorrect password",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// ---- Get Logged-In User ---- //
export async function getUserData(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req;

    res.json({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// ---- Get All Available Cars ---- //
export async function getCars(_req: Request, res: Response): Promise<void> {
  try {
    const cars = await Car.find({ isAvailable: true });

    res.json({
      success: true,
      message: "Cars fetched successfully",
      cars,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}
