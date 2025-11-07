import React, { useEffect } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton, Tooltip, Button, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
    ArrangeHorizontalSquare, ProfileTick, Back, ArchiveMinus, Candle, Layer, TextalignJustifyleft,
    EmptyWallet, UserAdd, UserEdit, Setting, Setting3, Setting4, Setting2
} from "iconsax-react";

export default function Sidebar({ collapsed, setCollapsed }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate(); // ✅ initialize navigate

    // Get user role from localStorage (same as your MainRouter)
    const userRole = localStorage.getItem("role");

    // Collapse sidebar on small screens by default
    useEffect(() => {
        if (isSmallScreen) {
            setCollapsed(true);
        }
    }, [isSmallScreen, setCollapsed]);

    // ✅ logout handler
    const handleLogout = () => {
        // Clear all session data
        localStorage.clear();
        sessionStorage.clear();

        // Navigate to login first
        navigate("/", { replace: true });
    };

    const navItems = [
        { label: "Account Statement",
            path: "/accountStatement",
            allowedRoles: [
                "ICT_Administrator",
                "Contact_Centre_Officer",
                "Branch_Maker",
                "Branch_Checker",
                "Security_Services_User",
                "Head_Office"
            ],
            icon: <ArrangeHorizontalSquare size="20" color="currentColor" /> },
        { label: "Account Management",
            path: "/accountManagement",
            allowedRoles: ["ICT_Administrator", "ICT_Service_Desk_Officer", "ICT_Service_Desk_Supervisor"],
            icon: <ProfileTick size="20" color="currentColor" /> },
        { label: "Approve Charge Waiver",
            path: "/approveChargeWaiver",
            allowedRoles: ["Branch_Checker"],
            icon: <EmptyWallet size="20" color="currentColor" /> },
        { label: "Track Record",
            path: "/trackRecord",
            allowedRoles: ["ICT_Administrator", "Branch_Maker", "Branch_Checker"],
            icon: <TextalignJustifyleft size="20" color="currentColor" /> },
        { label: "Print History",
            path: "/printHistory",
            allowedRoles: ["ICT_Administrator", "Branch_Maker", "Branch_Checker"],
            icon: <ArchiveMinus size="20" color="currentColor" /> },
        { label: "General Configs",
            path: "/generalConfigs",
            allowedRoles: ["ICT_Administrator", "ICT_Service_Desk_Maker", "ICT_Service_Desk_Checker"],
            icon: <Candle size="20" color="currentColor" /> },
        { label: "System Logs",
            path: "/systemLogs",
            allowedRoles: ["ICT_Administrator", "Branch_Maker", "Branch_Checker"],
            icon: <Layer size="20" color="currentColor" /> },
        { label: "Settings",
            path: "/settings",
            allowedRoles: ["ICT_Administrator", "ICT_Service_Desk_Officer", "ICT_Service_Desk_Supervisor"],
            icon: <Setting2 size="20" color="currentColor" /> },
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
        color: isActive ? "#116530" : "#606060",
        backgroundColor: isActive ? "#e6f2e6" : "transparent",
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
            <IconButton
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
            </IconButton>

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

            {/* Logout + Footer */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Tooltip title="Logout" placement="right">
                    <Button
                        onClick={handleLogout} // ✅ added click handler
                        startIcon={<Back size="24" color="currentColor" />}
                        sx={{
                            width: "100%",
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: collapsed ? 0 : 2,
                            color: "brown",
                            textTransform: "none",
                            mb: 1,
                            fontWeight: "bold", // ✅ makes the Logout text bold
                            fontSize: "15px",
                            transition: "all 0.2s",
                        }}
                    >
                        {!collapsed && "Logout"}
                    </Button>
                </Tooltip>

                <Box
                    sx={{
                        textAlign: "center",
                        pt: 1,
                        pb: 2,
                        borderTop: "1px solid #ddd",
                    }}
                >
                    {!collapsed ? (
                        <Typography variant="caption" color="text.secondary">
                            Account Statement Engine v1.0.0
                        </Typography>
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            v1.0.0
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

