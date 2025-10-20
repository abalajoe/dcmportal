import React, {useEffect, useState} from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import AccountStatement from "./components/AccountStatement";
import TrackRecord from "./components/TrackRecord";
import LoginPage from "./components/Login";
import PrintHistory from "./components/PrintHistory";
import SystemLogs from "./components/SystemLogs";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import ApproveChargeWaiver from "./components/ApproveChargeWaiver";
import AllSettings from "./components/AllSettings";
import AccountManagement from "./components/AccountManagement";
import GeneralConfigs2 from "./components/GeneralConfigs";
import GeneralConfigs from "./components/GeneralConfigs";

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

            {/* Protected routes */}
            <Route element={<MainLayout />}>
                <Route path="/accountStatement"
                       element={
                           <ProtectedRoute
                               element={<AccountStatement />}
                               allowedRoles={["ICT_Administrator", "Contact_Centre_Officer", "Branch_Maker", "Branch_Checker", "Security_Services_User", "Head_Office"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/accountManagement"
                       element={
                           <ProtectedRoute
                               element={<AccountManagement />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk_Maker", "ICT_Service_Desk_Checker"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/trackRecord"
                       element={
                           <ProtectedRoute
                               element={<TrackRecord />}
                               allowedRoles={["ICT_Administrator", "Branch_Maker", "Branch_Checker"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/approveChargeWaiver"
                       element={
                           <ProtectedRoute
                               element={<ApproveChargeWaiver />}
                               allowedRoles={["Branch_Checker"]}
                               userRole={userRole}
                           />
                       }
                />

                <Route path="/GeneralConfigs"
                       element={
                           <ProtectedRoute
                               element={<GeneralConfigs />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk_Maker", "ICT_Service_Desk_Checker"]}
                               userRole={userRole}
                           />
                       }
                />


                <Route path="/PrintHistory"
                       element={
                           <ProtectedRoute
                               element={<PrintHistory />}
                               allowedRoles={["ICT_Administrator", "Branch_Maker", "Branch_Checker"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/SystemLogs"
                       element={
                           <ProtectedRoute
                               element={<SystemLogs />}
                               allowedRoles={["ICT_Administrator", "Branch_Maker", "Branch_Checker"]}
                               userRole={userRole}
                           />
                       }
                />

                <Route path="/Settings"
                       element={
                           <ProtectedRoute
                               element={<AllSettings />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk_Maker", "ICT_Service_Desk_Checker"]}
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