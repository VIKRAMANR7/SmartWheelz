import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import crypto from "crypto";

import connectDB from "./configs/db.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Generate a new session key on each boot
export const SESSION_KEY = crypto.randomBytes(32).toString("hex");

const app = express();

//Global Middleware
app.use(cors());
app.use(express.json());

//Simple Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.send("Smartwheelz API is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Global Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Server Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Server Start Function
export async function startServer(): Promise<void> {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Smartwheelz server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

export default app;

startServer();
