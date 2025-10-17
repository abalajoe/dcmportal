import React from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Accepts both 'element' (your router uses this) and 'Component' (old prop name)
export default function ProtectedRoute({ element: Component, allowedRoles, userRole }) {
    console.log("🔒 ProtectedRoute Check:", {
        userRole,
        allowedRoles,
        isAllowed: userRole ? allowedRoles.includes(userRole) : false
    });

    // ✅ CRITICAL: Wait for role to load (prevents premature redirect)
    if (userRole === null || userRole === undefined) {
        console.log("⏳ Waiting for role to load...");
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // ✅ Check if user's role is in the allowed roles
    if (!allowedRoles.includes(userRole)) {
        console.log("❌ Access denied - Role:", userRole, "not in", allowedRoles);
        return <Navigate to="/unauthorized" replace />;
    }

    console.log("✅ Access granted to role:", userRole);
    return Component;
}