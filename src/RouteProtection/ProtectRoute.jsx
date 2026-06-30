import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles, publicOnly = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Determine the role-based home path for authenticated users
  const getRoleHome = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "co-admin") return "/co-admin";
    return "/user-dashboard";
  };

  // Public-only routes (sign-in, sign-up, home): redirect authenticated users away
  if (publicOnly && isAuthenticated && user) {
    return <Navigate to={getRoleHome()} replace />;
  }

  // Protected routes: redirect unauthenticated users to sign-in
  if (!publicOnly && !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role-based guard: redirect if user doesn't have the required role
  if (!publicOnly && allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHome()} replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;