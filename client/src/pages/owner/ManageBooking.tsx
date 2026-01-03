import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { assets } from "../../assets/assets";
import Title from "../../components/owner/OwnerSectionHeader";
import { useAppContext } from "../../context/AppContext";
import { getErrorMessage } from "../../utils/error";
import type { OwnerBooking } from "../../types/booking";

export default function ManageBooking() {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);

  async function fetchOwnerBookings() {
    try {
      const { data } = await axios.get("/api/bookings/owner");

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function changeBookingStatus(bookingId: string, status: string) {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });

      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  useEffect(() => {
    fetchOwnerBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t border-borderColor text-gray-500">
                <td className="p-3 flex items-center gap-3">
                  {booking.car ? (
                    <>
                      <img
                        src={booking.car.image || assets.placeholder_car}
                        onError={(e) => {
                          e.currentTarget.src = assets.placeholder_car;
                        }}
                        alt="Car"
                        className="size-12 aspect-square rounded-md object-cover"
                      />
                      <p className="font-medium max-md:hidden">
                        {booking.car.brand} {booking.car.model}
                      </p>
                    </>
                  ) : (
                    <p className="text-red-500 italic">[Deleted Car]</p>
                  )}
                </td>

                <td className="p-3 max-md:hidden">
                  {booking.pickupDate?.split("T")[0]} to {booking.returnDate?.split("T")[0]}
                </td>

                <td className="p-3">
                  {currency}
                  {booking.price}
                </td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">offline</span>
                </td>

                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                      value={booking.status}
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
