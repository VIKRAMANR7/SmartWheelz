import type { ICar } from "./car";

export interface IBooking {
  _id: string;
  car: ICar;
  status: string;
  pickupDate: string;
  returnDate: string;
  createdAt: string;
  price: number;
}

export interface OwnerBooking {
  _id: string;
  car: {
    _id: string;
    brand: string;
    model: string;
    image: string;
  } | null;
  pickupDate: string;
  returnDate: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface RecentBooking {
  _id: string;
  car?: { brand: string; model: string };
  createdAt: string;
  price: number;
  status: string;
}

export interface DashboardData {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  recentBookings: RecentBooking[];
  monthlyRevenue: number;
}
