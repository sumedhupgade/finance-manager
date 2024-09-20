import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import PageNotFound from "./components/PageNotFound";
import Header from "./components/common/Header";
import Loader from "./components/common/Loader";
import AuthWrapper from "./AuthWrapper";
import Debts from "./components/debt/Debt";
import Profile from "./components/profile/profile";
import { LoadingProvider } from "./context/LoadingContext";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <LoadingProvider>
      <Loader />
      <Router>
        {user && <Header setUser={setUser} />}
        <div className="scollable-parent">
          <Routes>
            <Route
              path="/"
              element={
                <AuthWrapper requiresAuth={false}>
                  <Login setUser={setUser} />
                </AuthWrapper>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthWrapper requiresAuth={false}>
                  <Signup setUser={setUser} />
                </AuthWrapper>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthWrapper requiresAuth={true}>
                  <Dashboard />
                </AuthWrapper>
              }
            />
            <Route
              path="/debts"
              element={
                <AuthWrapper requiresAuth={true}>
                  <Debts />
                </AuthWrapper>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthWrapper requiresAuth={true}>
                  <Profile />
                </AuthWrapper>
              }
            />
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </div>
      </Router>
    </LoadingProvider>
  );
};

export default App;
