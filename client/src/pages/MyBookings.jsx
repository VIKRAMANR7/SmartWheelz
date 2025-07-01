import { motion } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";

export default function MyBookings() {
  const { axios, user, currency, navigate, isLoading } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);

  const fetchMyBookings = async () => {
    setFetchingBookings(true);
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please log in to view your bookings.");
        navigate("/");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch bookings"
        );
      }
    } finally {
      setFetchingBookings(false);
    }
  };

  useEffect(() => {
    // Wait for auth verification to complete
    if (isLoading) return;

    if (!user) {
      navigate("/");
      toast.error("Please log in to view your bookings.");
    } else {
      fetchMyBookings();
    }
  }, [user, isLoading]);

  // Show loading while auth is being verified
  if (isLoading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="md:col-span-2 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your car bookings"
        align="left"
      />

      {fetchingBookings ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <img
            src={assets.calendar_icon_colored}
            alt=""
            className="mx-auto mb-4 opacity-50"
          />
          <p className="text-gray-500 text-lg">No bookings found</p>
          <p className="text-gray-400 mt-2">
            Your car rental bookings will appear here
          </p>
        </div>
      ) : (
        <div>
          {bookings.map((booking, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
            >
              {/* Car Image and Info */}
              <div className="md:col-span-1">
                <div className="rounded-md overflow-hidden mb-3">
                  <img
                    src={booking.car.image}
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className="w-full h-auto aspect-video object-cover"
                    onError={(e) => {
                      e.target.src =
                        assets.placeholder_car || "/placeholder-car.jpg";
                    }}
                  />
                </div>
                <p className="text-lg font-medium mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-gray-500">
                  {booking.car.year} &bull; {booking.car.category} &bull;{" "}
                  {booking.car.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="px-3 py-1.5 bg-light rounded">
                    Booking #{index + 1}
                  </p>
                  <p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-400/15 text-green-600"
                        : booking.status === "pending"
                        ? "bg-yellow-400/15 text-yellow-600"
                        : "bg-red-400/15 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="size-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {new Date(booking.pickupDate).toLocaleDateString()} To{" "}
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="size-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-1 flex flex-col justify-between gap-6">
                <div className="text-sm text-gray-500 text-right">
                  <p>Total Price</p>
                  <h1 className="text-2xl font-semibold text-primary">
                    {currency}
                    {booking.price}
                  </h1>
                  <p>
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
