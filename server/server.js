import cors from "cors";
import crypto from "crypto";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/db.js";
import bookingRouter from "./routes/bookingRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import userRouter from "./routes/userRoutes.js";

// ✅ Generate SESSION_KEY on every server restart
export const SESSION_KEY = crypto.randomBytes(32).toString("hex");

// Initialize app
const app = express();

// Connect to DB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
