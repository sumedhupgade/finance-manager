import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";

const AuthWrapper = ({ children, requiresAuth }) => {
  const [user, loading] = useAuthState(auth);
  if (!localStorage.getItem("user") && user !== null) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  if (loading) return <div className="page-loader">Loading...</div>;
  if (requiresAuth && !user) {
    // If the route requires authentication and the user is not logged in, redirect to login
    return <Navigate to="/" />;
  } else if (!requiresAuth && user) {
    // If the route does not require authentication and the user is logged in, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  // Otherwise, render the requested component
  return children;
};

export default AuthWrapper;
