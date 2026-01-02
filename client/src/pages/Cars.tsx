import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import { getErrorMessage } from "../utils/error";
import type { ICar } from "../types/car";

export default function Cars() {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [search, setSearch] = useState("");
  const [filteredCars, setFilteredCars] = useState<ICar[]>([]);

  const isAvailabilitySearch = pickupLocation && pickupDate && returnDate;

  const applyLocalFilter = useCallback(() => {
    if (!search.trim()) {
      setFilteredCars(cars);
      return;
    }

    const q = search.toLowerCase();

    const filtered = cars.filter((car) =>
      [car.brand, car.model, car.category, car.transmission].some((field) =>
        field.toLowerCase().includes(q)
      )
    );

    setFilteredCars(filtered);
  }, [search, cars]);

  const fetchAvailability = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setFilteredCars(data.availableCars);

        if (data.availableCars.length === 0) {
          toast("No cars available for the given date range");
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [axios, pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (isAvailabilitySearch) fetchAvailability();
  }, [isAvailabilitySearch, fetchAvailability]);

  useEffect(() => {
    if (!isAvailabilitySearch) applyLocalFilter();
  }, [search, cars, isAvailabilitySearch, applyLocalFilter]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center pt-16 pb-12 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our collection of premium vehicles available for your next adventure"
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="size-4.5 mr-2" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full outline-none text-gray-500"
          />

          <img src={assets.filter_icon} alt="" className="size-4.5 ml-2" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
