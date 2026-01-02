import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import { assets } from "../../assets/assets";
import OwnerSectionHeader from "../../components/owner/OwnerSectionHeader";
import { useAppContext } from "../../context/AppContext";
import { getErrorMessage } from "../../utils/error";
import type { DashboardData } from "../../types/booking";

export default function Dashboard() {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState<DashboardData>({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await axios.get("/api/owner/dashboard");

      if (res.data.success) {
        setData(res.data.dashboardData);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [axios]);

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner, fetchDashboardData]);

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ];

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <OwnerSectionHeader
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue and recent activities"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="size-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {data.recentBookings.map((booking, index) => (
            <div key={booking._id || index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img src={assets.listIconColored} alt="" className="size-5" />
                </div>
                <div>
                  <p>
                    {booking.car
                      ? `${booking.car.brand} ${booking.car.model}`
                      : "Car no longer available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <p className="text-sm text-gray-500">
                  {currency}
                  {booking.price}
                </p>
                <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
                  {booking.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
}
