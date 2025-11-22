import React, { useEffect } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import {
    EmptyWallet, Setting2, ArchiveAdd, Diagram, Bag2
} from "iconsax-react";

export default function Sidebar({ collapsed, setCollapsed }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate(); // ✅ initialize navigate

    // Get user role from localStorage (same as your MainRouter)
    const userRole = localStorage.getItem("role");

    // Collapse sidebar on small screens by default
    /*useEffect(() => {
        if (isSmallScreen) {
            setCollapsed(true);
        }
    }, [isSmallScreen, setCollapsed]);*/

    // ✅ logout handler
    const handleLogout = () => {
        // Clear all session data
        localStorage.clear();
        sessionStorage.clear();

        // Navigate to login first
        navigate("/", { replace: true });
    };

    const navItems = [
        { label: "Inventory",
            path: "/supplier",
            allowedRoles: ["Supplier","Distributor", "Retailer"],
            icon: <ArchiveAdd size="20" color="currentColor" /> },
        { label: "Orders",
            path: "/orders",
            allowedRoles: ["Distributor","Retailer"],
            icon: <Bag2 size="20" color="currentColor" /> },
        { label: "Reports",
            path: "/reports",
            allowedRoles: ["Supplier"],
            icon: <Diagram size="20" color="currentColor" /> },
        // { label: "Settings",
        //     path: "/settings",
        //     allowedRoles: ["Supplier"],
        //     icon: <Setting2 size="20" color="currentColor" /> },
    ];

    // ✅ Only show menus allowed for this user
    const filteredNavItems = navItems.filter((item) => item.allowedRoles.includes(userRole));

    const toggleCollapse = () => setCollapsed(!collapsed);

    const linkStyle = (isActive) => ({
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 12,
        padding: "10px 8px",
        textDecoration: "none",
        color: isActive ? "purple" : "#606060",
        backgroundColor: isActive ? "#FFD3D5" : "transparent",
        borderRadius: 2,
        margin: "6px 8px",
        justifyContent: collapsed ? "center" : "flex-start",
        transition: "all 0.2s",
    });

    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                top: 64,
                height: "calc(100vh - 64px)",
                width: collapsed ? 60 : 240,
                bgcolor: "#f9f9f9",
                borderRight: "1px solid #ddd",
                p: 1,
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s",
            }}
        >
            {/* Toggle button */}
           {/* <IconButton
                onClick={toggleCollapse}
                sx={{
                    mb: 1,
                    mt: 1,
                    alignSelf: collapsed ? "center" : "flex-end",
                    transition: "all 0.2s",
                }}
                size="small"
            >
                <MenuIcon />
            </IconButton>*/}

            {/* ✅ Filtered Navigation items */}
            <Box component="nav" sx={{ flexGrow: 1 }}>
                {filteredNavItems.map((item) => (
                    <NavLink key={item.path} to={item.path} style={({ isActive }) => linkStyle(isActive)}>
                        {collapsed ? (
                            <Tooltip title={item.label} placement="right">
                                <Box>{item.icon}</Box>
                            </Tooltip>
                        ) : (
                            <>
                                {item.icon}
                                <Box
                                    sx={{
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        transition: "width 0.2s, opacity 0.2s",
                                        width: "auto",
                                        opacity: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ml: 1,
                                            fontWeight: "bold",
                                            fontSize: "15px",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </NavLink>
                ))}
            </Box>
        </Box>
    );
}

