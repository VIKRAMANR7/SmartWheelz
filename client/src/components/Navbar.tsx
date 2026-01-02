import { motion } from "motion/react";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { getErrorMessage } from "../utils/error";

export default function Navbar() {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner, isLoading } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const changeRole = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");

      if (data.success) {
        setIsOwner(true);
        toast.success("Owner access granted! Welcome to your dashboard.");
        navigate("/owner");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, [axios, navigate, setIsOwner]);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4
          text-gray-600 border-b border-borderColor relative transition-all ${
            location.pathname !== "/" && "bg-light"
          }`}
      >
        <img src={assets.logo} alt="logo" className="h-8" />

        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4
        text-gray-600 border-b border-borderColor relative transition-all ${
          location.pathname !== "/" && "bg-light"
        }`}
    >
      <Link to="/">
        <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8" />
      </Link>

      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
          max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
          items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
          ${location.pathname !== "/" ? "bg-light" : "bg-white"}
          ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link) => (
          <Link key={link.path} to={link.path} onClick={() => setOpen(false)}>
            {link.name}
          </Link>
        ))}

        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search Products..."
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={() => {
              if (!user) {
                setShowLogin(true);
                return;
              }

              if (isOwner) {
                navigate("/owner");
              } else {
                changeRole();
              }
            }}
            className="cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => (user ? logout() : setShowLogin(true))}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
}
