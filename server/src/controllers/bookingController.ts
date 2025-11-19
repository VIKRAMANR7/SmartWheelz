import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { handleControllerError } from "../utils/handleError.js";

// ---- Check availability ---- //
async function checkAvailability(
  carId: string,
  pickupDate: Date,
  returnDate: Date
): Promise<boolean> {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
}

// Check availability of cars
export async function checkAvailabilityOfCar(req: Request, res: Response): Promise<void> {
  try {
    const { location, pickupDate, returnDate } = req.body;

    const cars = await Car.find({ location, isAvailable: true });

    const availabilityPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id.toString(), pickupDate, returnDate);

      return {
        ...car.toObject(),
        isAvailable,
      };
    });

    const availableCars = (await Promise.all(availabilityPromises)).filter(
      (car) => car.isAvailable
    );

    res.json({
      success: true,
      message: "Availability fetched successfully",
      availableCars,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Create Booking
export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      res.json({
        success: false,
        message: "Car is not available for the given date range",
      });
      return;
    }

    const carData = await Car.findById(car);
    if (!carData) {
      res.json({ success: false, message: "Car not found" });
      return;
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const price = carData.pricePerDay * days;

    await Booking.create({
      car,
      owner: carData.owner,
      user: userId,
      pickupDate,
      returnDate,
      price,
    });

    res.json({
      success: true,
      message: "Booking created successfully",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// User Bookings
export async function getUserBookings(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;

    const bookings = await Booking.find({ user: userId }).populate("car").sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "User bookings fetched successfully",
      bookings,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// Owner Bookings
export async function getOwnerBookings(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user || user.role !== "owner") {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const bookings = await Booking.find({ owner: user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Owner bookings fetched successfully",
      bookings,
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}

// ---- API: Change Booking Status ---- //
export async function changeBookingStatus(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.owner.toString() !== user._id.toString()) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated successfully",
    });
  } catch (error: unknown) {
    handleControllerError(res, error);
  }
}
