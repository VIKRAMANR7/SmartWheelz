export interface ICar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  location: string;
  image: string;
  pricePerDay: number;
  isAvailable: boolean;
  seating_capacity: number;
  fuel_type: string;
  transmission: string;
}

export interface CarForm {
  brand: string;
  model: string;
  year: string | number;
  pricePerDay: string | number;
  category: string;
  transmission: string;
  fuel_type: string;
  seating_capacity: string | number;
  location: string;
  description: string;
}

export interface CarDashboardItem extends ICar {
  owner: string | null;
}
