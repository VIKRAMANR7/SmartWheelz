import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SESSION_KEY } from "../configs/session.js";
import { asyncHandler } from "./asyncHandler.js";

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  // Extract Bearer token
  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    throw new Error("Not authorized, no token");
  }

  // Decode token
  const decoded = jwt.verify(token, process.env.JWT_SECRET + SESSION_KEY) as {
    id: string;
  };

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  req.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    image: user.image,
  };

  next();
});
