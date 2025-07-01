import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cars, setCars] = useState([]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const applyToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = (silent = false, message = "Logged out successfully") => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];
    if (!silent) toast.success(message);
  };

  const verifyAndFetchUser = async (setLoadingState = true) => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        logout(true, ""); // Silent logout for invalid token
        console.log("Token verification failed:", data.message);
      }
    } catch (error) {
      logout(true, ""); // Silent logout for network/server errors
      console.log("Token verification error:", error.message);
    } finally {
      if (setLoadingState) {
        setIsLoading(false);
      }
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      applyToken(storedToken);
      verifyAndFetchUser();
      const tokenExpiryTimeout = setTimeout(() => {
        logout(false, "Session expired. Please log in again.");
      }, 15 * 60 * 1000);
      fetchCars();
      return () => clearTimeout(tokenExpiryTimeout);
    } else {
      setIsLoading(false);
      fetchCars();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        currency,
        navigate,
        axios,
        user,
        setUser,
        isOwner,
        setIsOwner,
        showLogin,
        setShowLogin,
        token,
        setToken: applyToken,
        logout,
        fetchCars,
        cars,
        setCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        isLoading,
        verifyAndFetchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
