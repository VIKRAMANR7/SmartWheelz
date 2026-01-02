import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { getErrorMessage } from "../utils/error";

import type { IUser } from "../types/user";
import type { ICar } from "../types/car";
import type { IAppContext } from "../types/context";

const SESSION_TIMEOUT = 15 * 60 * 1000;

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext<IAppContext | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cars, setCars] = useState<ICar[]>([]);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const applyToken = useCallback((newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem("token", newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  }, []);

  const logout = useCallback((silent = false, message = "Logged out successfully") => {
    localStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
    setIsOwner(false);
    delete axios.defaults.headers.common["Authorization"];

    if (!silent) toast.success(message);
  }, []);

  const verifyAndFetchUser = useCallback(
    async (setLoadingState = true) => {
      try {
        const { data } = await axios.get("/api/user/data");

        if (data.success) {
          setUser(data.user);
          setIsOwner(data.user.role === "owner");
        } else {
          logout(true);
        }
      } catch {
        logout(true);
      } finally {
        if (setLoadingState) setIsLoading(false);
      }
    },
    [logout]
  );

  const fetchCars = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/cars");

      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      applyToken(storedToken);
      verifyAndFetchUser();

      const sessionTimeout = setTimeout(
        () => logout(false, "Session expired. Please log in again."),
        SESSION_TIMEOUT
      );

      fetchCars();

      return () => clearTimeout(sessionTimeout);
    }

    setIsLoading(false);
    fetchCars();
  }, [applyToken, verifyAndFetchUser, logout, fetchCars]);

  const value: IAppContext = {
    currency,
    navigate,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    token,
    setToken: applyToken,
    logout,
    cars,
    setCars,
    fetchCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    isLoading,
    verifyAndFetchUser,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
  return ctx;
}
