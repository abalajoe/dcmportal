import React, { useState } from "react";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 60;
const appBarHeight = 64;

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false); // default collapsed

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            {/* Navbar fixed at top */}
            <Navbar />

            <Box sx={{ display: "flex", flex: 1, pt: `${appBarHeight}px`, overflow: "hidden" }}>
                {/* Sidebar */}
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Main content area */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        pt: 2,
                        pb: 3,
                        pl: 2,
                        pr: 1,
                        bgcolor: "#f5f5f5",
                        height: `calc(100vh - ${appBarHeight}px)`,
                        overflowY: "auto",
                        transition: "margin-left 0.2s, width 0.2s",
                        ml: `${collapsed ? collapsedWidth : drawerWidth}px`, // dynamically offset based on sidebar
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
