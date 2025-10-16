import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ShieldCross } from "iconsax-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
                px: 2,
            }}
        >
            <ShieldCross size="80" color="#d32f2f" style={{ marginBottom: "20px" }} />

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#333",
                }}
            >
                Access Denied
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: "text.secondary",
                    mb: 3,
                    maxWidth: 400,
                }}
            >
                You do not have permission to view this page.
                Please contact your system administrator if you believe this is a mistake.
            </Typography>

            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                    background: "linear-gradient(90deg, #116530, #1b7a3e)",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    fontSize: "0.9rem",
                    "&:hover": {
                        background: "#0d4d24",
                    },
                }}
            >
                Go to Home
            </Button>
        </Box>
    );
}
