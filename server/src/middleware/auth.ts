import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "./asyncHandler.js";

function getIdFromToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);

  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "id" in decoded &&
    typeof decoded.id === "string"
  ) {
    return decoded.id;
  }

  throw new Error("Invalid token payload");
}

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (token?.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    throw new Error("Not authorized, no token");
  }

  const userId = getIdFromToken(token);

  const user = await User.findById(userId).select("-password");

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
