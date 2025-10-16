import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { SearchNormal1 } from "iconsax-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
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
            <SearchNormal1 size="80" color="#1976d2" style={{ marginBottom: "20px" }} />

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#333",
                }}
            >
                404 - Page Not Found
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: "text.secondary",
                    mb: 3,
                    maxWidth: 400,
                }}
            >
                Oops! The page you’re looking for doesn’t exist or may have been moved.
                Please check the URL or return to the homepage.
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
                Back to Home
            </Button>
        </Box>
    );
}
