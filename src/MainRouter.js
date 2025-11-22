import React, {useEffect, useState} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import AllSettings from "./components/AllSettings";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import Register from "./components/Register";
import Orders from "./components/Orders";

export default function MainRouter() {
    // ✅ Don't use default value - force it to read fresh each time
    const [userRole, setUserRole] = useState(() => localStorage.getItem("role"));
    const location = useLocation();

    // ✅ Update role on EVERY render when location changes
    useEffect(() => {
        const currentRole = localStorage.getItem("role");
        console.log("📍 Location changed to:", location.pathname, "| Role from localStorage:", currentRole);
        setUserRole(currentRole);
    }, [location.pathname]);

    // ✅ Listen for custom role update events
    useEffect(() => {
        const handleRoleUpdate = () => {
            const newRole = localStorage.getItem("role");
            console.log("🔄 Role updated event fired | New role:", newRole);
            setUserRole(newRole);
        };

        window.addEventListener('roleUpdated', handleRoleUpdate);
        return () => window.removeEventListener('roleUpdated', handleRoleUpdate);
    }, []);

    // ✅ Listen for storage changes (works across tabs)
    useEffect(() => {
        const handleStorageChange = () => {
            const newRole = localStorage.getItem("role");
            console.log("💾 Storage event fired | New role:", newRole);
            setUserRole(newRole);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    console.log("🎯 Current userRole in router:", userRole);

    return (
        <Routes>
            {/* Public route */}
            <Route path="/" element={<LoginPage />} />

            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
                <Route path="/inventory"
                       element={
                           <ProtectedRoute
                               element={<Inventory />}
                               allowedRoles={["Supplier","Distributor","Retailer"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/reports"
                       element={
                           <ProtectedRoute
                               element={<Reports />}
                               allowedRoles={["Supplier","Distributor","Retailer"]}
                               userRole={userRole}
                           />
                       }
                />

                <Route path="/orders"
                       element={
                           <ProtectedRoute
                               element={<Orders />}
                               allowedRoles={["Distributor","Retailer"]}
                               userRole={userRole}
                           />
                       }
                />

                <Route path="/Settings"
                       element={
                           <ProtectedRoute
                               element={<AllSettings />}
                               allowedRoles={["Supplier","Distributor","Retailer"]}
                               userRole={userRole}
                           />
                       }
                />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}