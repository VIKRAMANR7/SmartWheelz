import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SESSION_KEY } from "../server.js";

export async function protect(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.headers.authorization;

    // Extract Bearer token
    if (token?.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: "Not authorized, no token" });
      return;
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET + SESSION_KEY) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
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
  } catch {
    res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}
