import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/utils/error";

import type { IUser } from "@/types/user";
import type { ICar } from "@/types/car";
import type { IAppContext } from "@/types/context";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext<IAppContext | undefined>(undefined);

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

  // TOKEN HANDLING
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

  // VERIFY USER
  const verifyAndFetchUser = useCallback(
    async (setLoadingState = true): Promise<void> => {
      try {
        const { data } = await axios.get("/api/user/data");

        if (data.success) {
          setUser(data.user);
          setIsOwner(data.user.role === "owner");
        } else {
          logout(true);
          console.log("Token verification failed:", data.message);
        }
      } catch (err: unknown) {
        logout(true);
        console.log("Token verification error:", getErrorMessage(err));
      } finally {
        if (setLoadingState) setIsLoading(false);
      }
    },
    [logout]
  );

  // FETCH CARS
  const fetchCars = useCallback(async (): Promise<void> => {
    try {
      const { data } = await axios.get("/api/user/cars");

      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  }, []);

  // INITIAL APP LOAD
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      applyToken(storedToken);

      // Fetch user
      verifyAndFetchUser();

      // Auto-logout after 15 mins
      const sessionTimeout = setTimeout(
        () => logout(false, "Session expired. Please log in again."),
        15 * 60 * 1000
      );

      // Fetch cars for users
      fetchCars();

      return () => clearTimeout(sessionTimeout);
    }

    // No token: end loading + fetch public cars
    setIsLoading(false);
    fetchCars();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CONTEXT VALUE
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

// HOOK
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
  return ctx;
}
