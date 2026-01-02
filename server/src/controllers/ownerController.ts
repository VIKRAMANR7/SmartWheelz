import type { Request, Response } from "express";
import fs from "fs";

import imageKit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const changeRoleToOwner = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await User.findByIdAndUpdate(user._id, { role: "owner" });

  return res.json({ success: true, message: "Role changed to owner successfully" });
});

export const addCar = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  const carData = JSON.parse(req.body.carData);
  const buffer = fs.readFileSync(file.path);

  const uploaded = await imageKit.upload({
    file: buffer,
    fileName: file.originalname,
    folder: "/cars",
  });

  const imageUrl = imageKit.url({
    path: uploaded.filePath,
    transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
  });

  await Car.create({
    ...carData,
    owner: user._id,
    image: imageUrl,
  });

  return res.json({ success: true, message: "Car added successfully" });
});

export const getOwnerCars = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const cars = await Car.find({ owner: user._id });

  return res.json({ success: true, message: "Cars fetched successfully", cars });
});

export const toggleCarAvailability = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { carId } = req.body;
  const car = await Car.findById(carId);

  if (!car) {
    return res.status(404).json({ success: false, message: "Car not found" });
  }

  if (!car.owner || car.owner.toString() !== user._id.toString()) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  car.isAvailable = !car.isAvailable;
  await car.save();

  return res.json({ success: true, message: "Car availability toggled successfully" });
});

export const deleteCar = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { carId } = req.body;
  const car = await Car.findById(carId);

  if (!car) {
    return res.status(404).json({ success: false, message: "Car not found" });
  }

  if (!car.owner || car.owner.toString() !== user._id.toString()) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  car.owner = null;
  car.isAvailable = false;
  await car.save();

  return res.json({ success: true, message: "Car removed" });
});

export const deleteCarPermanently = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const car = await Car.findByIdAndDelete(id);

  if (!car) {
    return res.status(404).json({ success: false, message: "Car not found" });
  }

  return res.json({ success: true, message: "Car permanently deleted" });
});

export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || user.role !== "owner") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const cars = await Car.find({ owner: user._id });

  const bookings = await Booking.find({ owner: user._id }).populate("car").sort({ createdAt: -1 });

  const pending = await Booking.find({ owner: user._id, status: "pending" });
  const completed = await Booking.find({ owner: user._id, status: "confirmed" });

  const monthlyRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.price, 0);

  return res.json({
    success: true,
    message: "Dashboard data fetched successfully",
    dashboardData: {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pending.length,
      completedBookings: completed.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    },
  });
});

export const updateUserImage = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  const buffer = fs.readFileSync(file.path);

  const uploaded = await imageKit.upload({
    file: buffer,
    fileName: file.originalname,
    folder: "/users",
  });

  const imageUrl = imageKit.url({
    path: uploaded.filePath,
    transformation: [{ width: "400" }, { quality: "auto" }, { format: "webp" }],
  });

  await User.findByIdAndUpdate(user._id, { image: imageUrl });

  return res.json({ success: true, message: "Image updated successfully" });
});
