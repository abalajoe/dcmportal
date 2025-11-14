import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { User, Logout } from "iconsax-react"; // Logout icon

export default function Navbar() {
    const email = localStorage.getItem("curUserEmail");

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/"; // or use react-router navigate
    };

    return (
        <AppBar position="fixed" elevation={3} sx={{ backgroundColor: "purple" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                }}
            >
                {/* Left: Logo */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <h3>DCM</h3>
                </Box>

                {/* Center: Title */}
                <Typography
                    variant="h6"
                    sx={{
                        flex: 1,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 18,
                        display: { xs: "none", sm: "block" },
                    }}
                ></Typography>

                {/* Right: User + Email + Logout */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#fff",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        {email}
                    </Typography>

                    {/* Logout icon */}
                    <IconButton
                        onClick={handleLogout}
                        sx={{
                            color: "#fff",
                            ml: 1,
                            p: 0.5,
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        }}
                    >
                        <Logout size="18" color="#fff" />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
