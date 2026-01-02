import type { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

async function checkAvailability(carId: string, pickupDate: Date, returnDate: Date) {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
}

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

  return res.json({ success: true, message: "Availability fetched successfully", availableCars });
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { car, pickupDate, returnDate } = req.body;

  const isAvailable = await checkAvailability(car, pickupDate, returnDate);
  if (!isAvailable) {
    return res
      .status(400)
      .json({ success: false, message: "Car is not available for the given date range" });
  }

  const carData = await Car.findById(car);
  if (!carData) {
    return res.status(404).json({ success: false, message: "Car not found" });
  }

  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);

  const price = carData.pricePerDay * days;

  await Booking.create({
    car,
    owner: carData.owner,
    user: userId,
    pickupDate,
    returnDate,
    price,
  });

  return res.json({ success: true, message: "Booking created successfully" });
});

export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const bookings = await Booking.find({ user: userId }).populate("car").sort({ createdAt: -1 });

  return res.json({ success: true, message: "User bookings fetched successfully", bookings });
});

export const getOwnerBookings = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || user.role !== "owner") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const bookings = await Booking.find({ owner: user._id })
    .populate("car user")
    .select("-user.password")
    .sort({ createdAt: -1 });

  return res.json({ success: true, message: "Owner bookings fetched successfully", bookings });
});

export const changeBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { bookingId, status } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (booking.owner.toString() !== user._id.toString()) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  booking.status = status;
  await booking.save();

  return res.json({ success: true, message: "Booking status updated successfully" });
});
