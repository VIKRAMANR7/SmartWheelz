import type { Request, Response } from "express";
import fs from "fs";

import imageKit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { handleControllerError } from "../utils/handleError.js";

// Change role from user → owner
export async function changeRoleToOwner(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    await User.findByIdAndUpdate(user._id, { role: "owner" });

    res.json({
      success: true,
      message: "Role changed to owner successfully",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Add Car
export async function addCar(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "Image file is required" });
      return;
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
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Get Owner Cars
export async function getOwnerCars(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const cars = await Car.find({ owner: user._id });

    res.json({
      success: true,
      message: "Cars fetched successfully",
      cars,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Toggle Car Availability
export async function toggleCarAvailability(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) {
      res.status(404).json({ success: false, message: "Car not found" });
      return;
    }

    if (!car.owner || car.owner.toString() !== user._id.toString()) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({
      success: true,
      message: "Car availability toggled successfully",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Soft Delete Car
export async function deleteCar(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) {
      res.status(404).json({ success: false, message: "Car not found" });
      return;
    }

    if (!car.owner || car.owner.toString() !== user._id.toString()) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({
      success: true,
      message: "Car removed",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Permanent Delete Car
export async function deleteCarPermanently(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      res.status(404).json({
        success: false,
        message: "Car not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Car permanently deleted",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Dashboard Data
export async function getDashboardData(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user || user.role !== "owner") {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const cars = await Car.find({ owner: user._id });

    const bookings = await Booking.find({ owner: user._id })
      .populate("car")
      .sort({ createdAt: -1 });

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
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Update User Image
export async function updateUserImage(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "Image file is required" });
      return;
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
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}
