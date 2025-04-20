import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./apps/auth/components/Login";
import Policy from "./apps/home/components/Policy.js";
import Terms from "./apps/home/components/Terms.js";
import Privacy from "./apps/home/components/Privacy.js";
import Signup from "./apps/auth/components/Signup";
import ForgotPassword from "./apps/auth/components/ForgotPassword";
import Home from "./apps/home/components/Home";
import Bot from "./apps/home/components/Bot";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path="/bot/:tokens" element={<Bot />} />

          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
