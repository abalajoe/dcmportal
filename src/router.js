import React, {useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import AccountStatement from "./components/AccountStatement";
import TrackRecord from "./components/TrackRecord";
import LoginPage from "./components/Login";
import Roles from "./components/Roles";
import GeneralConfigs from "./components/GeneralConfigs";
import PrintHistory from "./components/PrintHistory";
import AccountManagement from "./components/AccountManagement";
import AccountManagement2 from "./components/AccountManagement2";
import SystemLogs from "./components/SystemLogs";
import AccountManagement3 from "./components/AccountManagement3";
import AccountStatement2 from "./components/AccountStatement2";
import GeneralConfigs2 from "./components/GeneralConfigs2";
import PrintHistory2 from "./components/PrintHistory2";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import ApproveChargeWaiver from "./components/ApproveChargeWaiver";
import AccountManagement4 from "./components/AccountManagement4";

export default function MainRouter() {
    const [userRole, setUserRole] = useState(localStorage.getItem("role") || "USER");

    // 🔁 Keep userRole in sync with localStorage changes (including login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            setUserRole(localStorage.getItem("role") || "USER");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    console.log("userRole - ", userRole);

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
                <Route path="/accountStatement2"
                       element={
                           <ProtectedRoute
                               element={<AccountStatement2 />}
                               allowedRoles={["ICT_Administrator", "Contact_Centre_Officer", "Branch_Maker", "Branch_Checker", "Security_Services_User", "Head_Office"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/accountManagement3"
                       element={
                           <ProtectedRoute
                               element={<AccountManagement />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk", "USER"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/accountManagement2"
                       element={
                           <ProtectedRoute
                               element={<AccountManagement2 />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk", "USER"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/accountManagement"
                       element={
                           <ProtectedRoute
                               element={<AccountManagement4 />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk", "USER"]}
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
                <Route path="/roles"
                       element={
                           <ProtectedRoute
                               element={<Roles />}
                               allowedRoles={["ICT_Administrator", "ICT_Service_Desk"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/GeneralConfigs2"
                       element={
                           <ProtectedRoute
                               element={<GeneralConfigs />}
                               allowedRoles={["ICT_Administrator", "ADMIN", "USER"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/GeneralConfigs"
                       element={
                           <ProtectedRoute
                               element={<GeneralConfigs2 />}
                               allowedRoles={["ICT_Administrator", "ADMIN", "USER"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/PrintHistory"
                       element={
                           <ProtectedRoute
                               element={<PrintHistory2 />}
                               allowedRoles={["ICT_Administrator", "Branch_Maker", "Branch_Checker"]}
                               userRole={userRole}
                           />
                       }
                />
                <Route path="/PrintHistory2"
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
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
    // return (
    //     <Routes>
    //         {/*<Route path="/" element={<MainLayout />}>*/}
    //         <Route path="/" element={<Login />}>
    //             <Route index element={<AccountStatement />} />
    //             <Route path="reports" element={<TrackRecord />} />
    //             {/*<Route path="settings" element={<Settings />} />*/}
    //             <Route path="*" element={<Navigate to="/" replace />} />
    //         </Route>
    //     </Routes>
    // );
}
