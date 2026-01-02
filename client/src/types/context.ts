import type { AxiosInstance } from "axios";
import type { IUser } from "./user";
import type { ICar } from "./car";

export interface IAppContext {
  currency: string;
  navigate: (path: string) => void;

  user: IUser | null;
  setUser: (user: IUser | null) => void;

  isOwner: boolean;
  setIsOwner: (value: boolean) => void;

  showLogin: boolean;
  setShowLogin: (value: boolean) => void;

  token: string | null;
  setToken: (token: string) => void;
  logout: (silent?: boolean, message?: string) => void;

  cars: ICar[];
  setCars: (cars: ICar[]) => void;
  fetchCars: () => Promise<void>;

  pickupDate: string;
  setPickupDate: (date: string) => void;

  returnDate: string;
  setReturnDate: (date: string) => void;

  isLoading: boolean;
  verifyAndFetchUser: (setLoadingState?: boolean) => Promise<void>;

  axios: AxiosInstance;
}
