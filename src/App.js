import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ProfileSetupPage from "./ProfileSetupPage";
import ProfilePage from "./ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default root goes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User pages */}
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;