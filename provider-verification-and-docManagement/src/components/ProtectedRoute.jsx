import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
    const token = sessionStorage.getItem("token");

    const providerData =
        sessionStorage.getItem("provider");

    if (!token || !providerData) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    const provider =
        JSON.parse(providerData);

    if (!allowedRoles.includes(provider.role)) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;