import { useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
import type { ICar } from "@/types/car";

interface CarCardProps {
  car: ICar;
}

export default function CarCard({ car }: CarCardProps) {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const goToDetails = () => {
    navigate(`/car-details/${car._id}`);
    scrollTo(0, 0);
  };

  return (
    <div
      onClick={goToDetails}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car Image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Name, model, category */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">
              {car.brand} {car.model}
            </h3>
            <p className="text-muted-foreground text-sm">
              {car.category} • {car.year}
            </p>
          </div>
        </div>

        {/* 4 Spec Grid – EXACT SAME ORDER AS CAR DETAILS */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 text-sm">
          {/* Seats */}
          <div className="flex items-center text-muted-foreground">
            <img src={assets.users_icon} alt="" className="h-4 mr-2" />
            <span>{car.seating_capacity} Seats</span>
          </div>

          {/* Fuel Type */}
          <div className="flex items-center text-muted-foreground">
            <img src={assets.fuel_icon} alt="" className="h-4 mr-2" />
            <span>{car.fuel_type}</span>
          </div>

          {/* Transmission */}
          <div className="flex items-center text-muted-foreground">
            <img src={assets.car_icon} alt="" className="h-4 mr-2" />
            <span>{car.transmission}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-muted-foreground">
            <img src={assets.location_icon} alt="" className="h-4 mr-2" />
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
