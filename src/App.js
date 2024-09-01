import "./App.css";
import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import PageNotFound from "./components/PageNotFound";
import Header from "./components/common/Header";
import AuthWrapper from "./AuthWrapper";
function App() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [])
  return (
    <Router>
      {user && <Header setUser={setUser}/>}
      <Routes>
        <Route path="/" element={<AuthWrapper requiresAuth={false}><Login setUser={setUser}/></AuthWrapper>}></Route>
        <Route path="/signup" element={<AuthWrapper requiresAuth={false}><Signup setUser={setUser}/></AuthWrapper>}></Route>
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
