import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  linkedinProvider,
  microsoftProvider,
} from "./firebase";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const syncWithBackend = async (user) => {
    if (!user) return;
    const idToken = await user.getIdToken(true);
  
    const body = {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoUrl: user.photoURL ?? null,
      providerId: user.providerData?.[0]?.providerId ?? null,
    };
  
    // Call backend login
    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      body,
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
  
    // Load existing local profile (from ProfileSetup)
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
  
    // Merge backend + local profile
    const mergedUser = {
      ...existingUser,          // keep firstName, lastName, photo if already set
      ...response.data,         // backend fields (uid, email, etc.)
      displayName: user.displayName ?? response.data.displayName,
      photoUrl:
        user.photoURL ??
        response.data.photoUrl ??
        existingUser.photo,     // fallback to local photo
    };
  
    localStorage.setItem("user", JSON.stringify(mergedUser));
    console.log("✅ Stored user (merged):", mergedUser);
  
    // Redirect to profile
    navigate("/profile");
  };
  
  // --- Email/Password login ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("Email Login Error:", error.message);
      alert(error.message);
    }
  };

  // --- OAuth logins ---
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("Microsoft Login Error:", error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("GitHub Login Error:", error);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, linkedinProvider);
      await syncWithBackend(result.user);
    } catch (error) {
      console.error("LinkedIn Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Log In</h2>

        <button className="btn google" onClick={handleGoogleSignIn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Log in with Google
        </button>

        <button className="btn microsoft" onClick={handleMicrosoftSignIn}>
          <img
            src="https://img.icons8.com/color/48/000000/microsoft.png"
            alt="Microsoft"
          />
          Log in with Microsoft
        </button>

        <button className="btn github" onClick={handleGithubSignIn}>
          <img
            src="https://img.icons8.com/material-outlined/48/000000/github.png"
            alt="GitHub"
          />
          Log in with GitHub
        </button>

        <button className="btn linkedin" onClick={handleLinkedInSignIn}>
          <img
            src="https://img.icons8.com/color/48/000000/linkedin.png"
            alt="LinkedIn"
          />
          Log in with LinkedIn
        </button>

        <div className="divider">Or</div>

        {/* Email/Password login form */}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary">
            Log In
          </button>
        </form>

        <p>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
