import React from "react";
import { Navigate } from "react-router-dom";

// Example: roles could be ["ROOT", "ADMIN", "USER"]
export default function ProtectedRoute({ element: Component, allowedRoles, userRole }) {
    // Check if user's role is allowed
    if (!allowedRoles.includes(userRole)) {
        // Redirect to home or unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    // If allowed, render the component
    return Component;
}
