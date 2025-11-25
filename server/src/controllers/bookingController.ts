import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// ---- Utility: Check availability for a single car ---- //
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

// ---- Check availability of all cars in location ---- //
export const checkAvailabilityOfCar = asyncHandler(async (req: Request, res: Response) => {
  const { location, pickupDate, returnDate } = req.body;

  const cars = await Car.find({ location, isAvailable: true });

  const availability = await Promise.all(
    cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id.toString(), pickupDate, returnDate);

      return {
        ...car.toObject(),
        isAvailable,
      };
    })
  );

  const availableCars = availability.filter((car) => car.isAvailable);

  res.json({
    success: true,
    message: "Availability fetched successfully",
    availableCars,
  });
});

// ---- Create Booking ---- //
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { car, pickupDate, returnDate } = req.body;

  const isAvailable = await checkAvailability(car, pickupDate, returnDate);
  if (!isAvailable) {
    throw new Error("Car is not available for the given date range");
  }

  const carData = await Car.findById(car);
  if (!carData) {
    throw new Error("Car not found");
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
});

// ---- User Bookings ---- //
export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const bookings = await Booking.find({ user: userId }).populate("car").sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "User bookings fetched successfully",
    bookings,
  });
});

// ---- Owner Bookings ---- //
export const getOwnerBookings = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || user.role !== "owner") {
    throw new Error("Unauthorized");
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
});

// ---- Change Booking Status ---- //
export const changeBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { bookingId, status } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.owner.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  booking.status = status;
  await booking.save();

  res.json({
    success: true,
    message: "Booking status updated successfully",
  });
});
