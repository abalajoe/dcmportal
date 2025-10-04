import React from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const drawerWidth = 240;
const appBarHeight = 64;

export default function MainLayout() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            {/* Navbar fixed at top */}
            <Navbar />

            <Box sx={{ display: "flex", flex: 1, pt: `${appBarHeight}px`, overflow: "hidden" }}>
                {/* Sidebar fixed height */}
                <Box
                    component="aside"
                    sx={{
                        width: `${drawerWidth}px`,
                        flexShrink: 0,
                        borderRight: "1px solid rgba(0,0,0,0.12)",
                        bgcolor: "background.paper",
                        height: `calc(100vh - ${appBarHeight}px)`,
                        overflowY: "auto",
                    }}
                >
                    <Sidebar />
                </Box>

                {/* Main content area */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        bgcolor: "#f5f5f5",
                        height: `calc(100vh - ${appBarHeight}px)`,
                        overflowY: "auto", // ✅ only this scrolls when content overflows
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
