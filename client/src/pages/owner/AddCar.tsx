import { useState } from "react";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";
import Title from "@/components/owner/OwnerSectionHeader";
import { useAppContext } from "@/context/AppContext";
import { getErrorMessage } from "@/utils/error";

import type { CarForm } from "@/types/car";

const initialCarData: CarForm = {
  brand: "",
  model: "",
  year: "",
  pricePerDay: "",
  category: "",
  transmission: "",
  fuel_type: "",
  seating_capacity: "",
  location: "",
  description: "",
};

export default function AddCar() {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState<File | null>(null);
  const [car, setCar] = useState<CarForm>(initialCarData);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);

      // Convert number fields before sending
      const formattedCar = {
        ...car,
        year: Number(car.year),
        pricePerDay: Number(car.pricePerDay),
        seating_capacity: Number(car.seating_capacity),
      };

      formData.append("carData", JSON.stringify(formattedCar));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar(initialCarData);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Car preview"
              className="h-14 rounded cursor-pointer"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label>Brand</label>
            <input
              type="text"
              required
              placeholder="e.g. BMW, Audi..."
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label>Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Q7, M4..."
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* Year, Price, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Year</label>
            <input
              type="number"
              required
              placeholder="2025"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              required
              placeholder="3500"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <label>Category</label>
            <select
              value={car.category}
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </div>

        {/* Transmission, Fuel, Seating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label>Transmission</label>
            <select
              value={car.transmission}
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Fuel Type</label>
            <select
              value={car.fuel_type}
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Seating Capacity</label>
            <input
              type="number"
              required
              placeholder="5"
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label>Location</label>
          <select
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
          >
            <option value="">Select a location</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="New Delhi">New Delhi</option>
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            rows={5}
            required
            placeholder="Describe the car, features, condition..."
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white text-md rounded-md font-medium cursor-pointer disabled:opacity-50"
        >
          <img src={assets.tick_icon} alt="tick" />
          {isLoading ? "Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
}
