import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { User } from "iconsax-react";

export default function Navbar() {
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
                <Box sx={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
                    <img src="/cooplogo.jpeg" alt="logo" style={{ height: 36 }} />
                </Box>

                {/* Center: Title (hidden on small screens) */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flex: "1 1 auto",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                        fontSize: 18,
                        display: { xs: "none", sm: "block" }, // 👈 hides on xs (mobile)
                    }}
                >
                    Account Statement
                </Typography>

                {/* Right: User Email */}
                <Box
                    sx={{
                        flex: "0 0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        whiteSpace: "nowrap",
                        gap: 1,
                    }}
                >
                    <User size="15" color="#fff" />
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#fff",
                            fontSize: "14px",
                        }}
                    >
                        joeabala@co-opbank.co.ke
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
