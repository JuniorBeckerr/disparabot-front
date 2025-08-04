import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../context/AuthContext";

export const ProtectedRoute = () => {
    return getToken() ? <Outlet /> : <Navigate to="/login" />;
};
