import cors from "cors";
import "dotenv/config";
import express, { type Request, type Response } from "express";

import connectDB from "./configs/db.js";
import { validateEnv } from "./configs/validateEnv.js";
import { errorHandler } from "./middleware/errorHandler.js";

import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

validateEnv();

await connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://smartwheelz-frontend.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Smartwheelz API is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Smartwheelz server running on port ${PORT}`);
});

export default app;
