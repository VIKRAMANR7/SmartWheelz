import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useLocation } from "react-router-dom";

import { assets, ownerMenuLinks } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { getErrorMessage } from "../../utils/error";

export default function Sidebar() {
  const { user, axios, verifyAndFetchUser } = useAppContext();
  const location = useLocation();

  const [image, setImage] = useState<File | null>(null);

  const updateImage = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData);

      if (data.success) {
        toast.success(data.message);
        await verifyAndFetchUser();
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const displayImage = image
    ? URL.createObjectURL(image)
    : user?.image
      ? user.image
      : assets.display_image;

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      {/* USER AVATAR */}
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={displayImage}
            alt="user avatar"
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImage(file);
            }}
          />

          {/* Hover overlay */}
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>

      {/* Save button */}
      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
        >
          Save
          <img src={assets.check_icon} alt="save" />
        </button>
      )}

      {/* User name */}
      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      {/* MENU */}
      <div className="w-full mt-4">
        {ownerMenuLinks.map((link, index) => {
          const active = link.path === location.pathname;

          return (
            <NavLink
              key={index}
              to={link.path}
              className={`relative flex items-center gap-2 w-full py-3 pl-4 ${
                active ? "bg-primary/10 text-primary" : "text-gray-600"
              }`}
            >
              <img
                src={active ? link.coloredIcon : link.icon}
                alt={link.name}
                className="h-5 w-5"
              />

              <span className="max-md:hidden">{link.name}</span>

              {active && <div className="bg-primary w-1.5 h-8 rounded-l right-0 absolute"></div>}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
