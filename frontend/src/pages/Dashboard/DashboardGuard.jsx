import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";

function DashboardGuard() {
  const { unauthorized } = useGlobalContext();
  useEffect(() => {
    unauthorized();
  });
  return <Outlet />;
}

export default DashboardGuard;
