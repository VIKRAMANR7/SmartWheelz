import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";

export default function ManageCars() {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const archiveOrRestoreCar = async (carId, isListed) => {
    const confirm = window.confirm(
      isListed
        ? "Are you sure you want to unlist this car?"
        : "Do you want to relist this car?"
    );
    if (!confirm) return;

    try {
      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCarPermanently = async (carId) => {
    const confirm = window.confirm(
      "⚠️ Are you absolutely sure you want to permanently delete this car?"
    );
    if (!confirm) return;

    try {
      const { data } = await axios.delete(`/api/owner/delete-car/${carId}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, toggle availability, archive or permanently delete them"
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="size-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} &bull; {car.transmission}
                    </p>
                  </div>
                </td>
                <td className="p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency}
                  {car.pricePerDay}/day
                </td>
                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="flex items-center gap-4 p-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt="Toggle Availability"
                    title="Toggle Availability"
                    className="cursor-pointer"
                  />
                  <img
                    onClick={() =>
                      archiveOrRestoreCar(car._id, car.owner !== null)
                    }
                    src={
                      car.owner === null
                        ? assets.archiveRestore_icon
                        : assets.archive_icon
                    }
                    alt={car.owner === null ? "Restore Car" : "Archive Car"}
                    title={
                      car.owner === null
                        ? "Restore (Relist) Car"
                        : "Archive (Unlist) Car"
                    }
                    className="cursor-pointer"
                  />
                  <img
                    onClick={() => deleteCarPermanently(car._id)}
                    src={assets.delete_icon}
                    alt="Delete Permanently"
                    title="Delete Permanently"
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
