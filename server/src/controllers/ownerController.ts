import type { Request, Response } from "express";
import fs from "fs";

import imageKit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Change role from user → owner
export const changeRoleToOwner = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error("Unauthorized");
  }

  await User.findByIdAndUpdate(user._id, { role: "owner" });

  res.json({
    success: true,
    message: "Role changed to owner successfully",
  });
});

// Add Car
export const addCar = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error("Unauthorized");
  }

  const file = req.file;
  if (!file) {
    throw new Error("Image file is required");
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

  res.json({
    success: true,
    message: "Car added successfully",
  });
});

// Get Owner Cars
export const getOwnerCars = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const cars = await Car.find({ owner: user._id });

  res.json({
    success: true,
    message: "Cars fetched successfully",
    cars,
  });
});

// Toggle Car Availability
export const toggleCarAvailability = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { carId } = req.body;
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  if (!car.owner || car.owner.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  car.isAvailable = !car.isAvailable;
  await car.save();

  res.json({
    success: true,
    message: "Car availability toggled successfully",
  });
});

// Soft Delete Car
export const deleteCar = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { carId } = req.body;
  const car = await Car.findById(carId);

  if (!car) {
    throw new Error("Car not found");
  }

  if (!car.owner || car.owner.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  car.owner = null;
  car.isAvailable = false;
  await car.save();

  res.json({
    success: true,
    message: "Car removed",
  });
});

// Permanent Delete Car
export const deleteCarPermanently = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const car = await Car.findByIdAndDelete(id);

  if (!car) {
    throw new Error("Car not found");
  }

  res.json({
    success: true,
    message: "Car permanently deleted",
  });
});

// Dashboard Data
export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || user.role !== "owner") {
    throw new Error("Unauthorized");
  }

  const cars = await Car.find({ owner: user._id });

  const bookings = await Booking.find({ owner: user._id }).populate("car").sort({ createdAt: -1 });

  const pending = await Booking.find({ owner: user._id, status: "pending" });
  const completed = await Booking.find({ owner: user._id, status: "confirmed" });

  const monthlyRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.price, 0);

  res.json({
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

// Update User Image
export const updateUserImage = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const file = req.file;
  if (!file) {
    throw new Error("Image file is required");
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

  res.json({
    success: true,
    message: "Image updated successfully",
  });
});
