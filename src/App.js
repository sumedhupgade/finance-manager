import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import PageNotFound from "./components/PageNotFound";
import Header from "./components/dashboard/Header";
import AuthWrapper from "./AuthWrapper";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthWrapper requiresAuth={false}><Login /></AuthWrapper>}></Route>
        <Route path="/signup" element={<AuthWrapper requiresAuth={false}><Signup /></AuthWrapper>}></Route>
        <Route
          path="/dashboard"
          element={<AuthWrapper requiresAuth={true}><Dashboard  /></AuthWrapper>}
        ></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
