import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavbarOwner from "@/components/owner/NavbarOwner";
import Sidebar from "@/components/owner/Sidebar";
import { useAppContext } from "@/context/AppContext";

export default function Layout() {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner, navigate]);

  return (
    <div className="flex flex-col">
      <NavbarOwner />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
