import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Navbar() {
    return (
        <AppBar
            position="fixed"
            elevation={3}
            sx={{ backgroundColor: "#116530" }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap", // wrap on small screens
                    px: 2,
                }}
            >
                {/* Left: Logo */}
                <Box sx={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
                    <img src="/cooplogo.jpeg" alt="logo" style={{ height: 36 }} />
                </Box>

                {/* Center: Title */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flex: "1 1 auto",        // takes remaining space
                        textAlign: "center",     // center horizontally
                        minWidth: 0,             // allow shrinking
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                    }}
                >
                     Account Statement
                </Typography>

                {/* Right: User Email */}
                <Box
                    sx={{
                        flex: "0 0 auto",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        mt: { xs: 1, sm: 0 },   // wrap margin on small screens
                    }}
                >
                    <Typography variant="body2" sx={{ color: "#fff",fontWeight: "bold", }}>
                        joeabala@co-0pbank.co.ke
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
