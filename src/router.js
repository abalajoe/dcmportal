import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import LoginPage from "./components/Login";
import Roles from "./components/Roles";


export default function MainRouter() {
    return (
        <Routes>
            {/* Public route */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
                <Route path="/accountstatement" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/roles" element={<Roles />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
    // return (
    //     <Routes>
    //         {/*<Route path="/" element={<MainLayout />}>*/}
    //         <Route path="/" element={<Login />}>
    //             <Route index element={<Dashboard />} />
    //             <Route path="reports" element={<Reports />} />
    //             {/*<Route path="settings" element={<Settings />} />*/}
    //             <Route path="*" element={<Navigate to="/" replace />} />
    //         </Route>
    //     </Routes>
    // );
}
