import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


export default function Navbar() {
    return (
        <AppBar
            position="fixed"
            elevation={3}
            sx={{ backgroundColor: "#116530" }} // bank green; adjust
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img src="/cooplogo.jpeg" alt="logo" style={{ height: 36 }} />
                    <Typography variant="h6" component="div" sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontWeight: 500
                    }}>
                        Account Statement
                    </Typography>
                </Box>

                <Box>
                    <Button color="inherit">LOGOUT</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
