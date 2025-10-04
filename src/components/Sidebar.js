import React from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const linkStyle = (isActive) => ({
    display: "block",
    padding: "12px 20px",
    textDecoration: "none",
    color: isActive ? "#fff" : "rgba(0,0,0,0.87)",
    backgroundColor: isActive ? "#116530" : "transparent",
    borderRadius: 2,
    margin: "6px 8px",
});

export default function Sidebar() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                left: 0,
                top: 64, // start below AppBar
                height: "calc(100vh - 64px)", // full height minus AppBar
                width: 240,
                bgcolor: "#f9f9f9",
                borderRight: "1px solid #ddd",
                p: 1,
            }}
        >
            {/* Navigation Links */}
            <Box component="nav" sx={{ flexGrow: 1 }}>
                <NavLink to="/accountstatement" end style={({ isActive }) => linkStyle(isActive)}>
                    Account Statement
                </NavLink>

                <NavLink to="/reports" style={({ isActive }) => linkStyle(isActive)}>
                    Reports
                </NavLink>

                <NavLink to="/roles" style={({ isActive }) => linkStyle(isActive)}>
                    Roles
                </NavLink>
            </Box>

            {/* Footer / Version */}
            <Box
                sx={{
                    mt: "auto",
                    textAlign: "center",
                    pt: 1,
                    pb: 2,
                    borderTop: "1px solid #ddd",
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Account Statement Engine v1.0.0
                </Typography>
            </Box>
        </Box>
    );
}
