import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { User } from "iconsax-react";

export default function Navbar() {
    const email = localStorage.getItem('curUserEmail');
    const role = localStorage.getItem('role');
    const roleName = role.replace(/_/g, " ");

    return (
        <AppBar position="fixed" elevation={3} sx={{ backgroundColor: "#116530" }}>
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
                    <img src="/cooplogo.jpeg" alt="logo" style={{ height: 36 }} />
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
                >
                    Account Statement
                </Typography>

                {/* Right: Email + Role */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#fff",
                        whiteSpace: "nowrap",
                    }}
                >
                    <User size="16" color="#fff" />
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                        {email} | <strong style={{ fontStyle: "bold", fontWeight: 600 }}>{roleName}</strong>
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
