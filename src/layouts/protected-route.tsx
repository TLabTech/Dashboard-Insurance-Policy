import { useAuthStore } from "@/app/auth/store";
import { NotFoundPage } from "@/components/404";
import React from "react";
import { Outlet } from "react-router";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  const getCurrentUserRole = () => {
    return user ? user.role.name : null;
  }

  const userRole = getCurrentUserRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <NotFoundPage />
  }

  return (
    <Outlet />
  )
}