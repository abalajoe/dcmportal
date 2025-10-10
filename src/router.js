import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";

import AccountStatement from "./components/AccountStatement";
import TrackRecord from "./components/TrackRecord";
import LoginPage from "./components/Login";
import Roles from "./components/Roles";
import GeneralConfigs from "./components/GeneralConfigs";
import PrintHistory from "./components/PrintHistory";
import AccountManagement from "./components/AccountManagement";
import SystemLogs from "./components/SystemLogs";


export default function MainRouter() {
    return (
        <Routes>
            {/* Public route */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
                <Route path="/accountStatement" element={<AccountStatement />} />
                <Route path="/accountManagement" element={<AccountManagement />} />
                <Route path="/trackRecord" element={<TrackRecord />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/GeneralConfigs" element={<GeneralConfigs />} />
                <Route path="/PrintHistory" element={<PrintHistory />} />
                <Route path="/SystemLogs" element={<SystemLogs />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
