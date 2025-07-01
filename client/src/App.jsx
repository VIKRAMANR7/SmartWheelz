import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { useAppContext } from "./context/AppContext";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import AddCar from "./pages/owner/AddCar";
import Dashboard from "./pages/owner/Dashboard";
import Layout from "./pages/owner/Layout";
import ManageBooking from "./pages/owner/ManageBooking";
import ManageCars from "./pages/owner/ManageCars";

export default function App() {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBooking />} />
        </Route>
      </Routes>
      {!isOwnerPath && <Footer />}
    </>
  );
}
