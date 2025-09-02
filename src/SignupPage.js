import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  linkedinProvider,
  microsoftProvider,
} from "./firebase";
import axios from "axios";
import "./LoginPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Sync with backend
  const syncWithBackend = async (user) => {
    if (!user) return;
    const idToken = await user.getIdToken(true);

    try {
      // Step 1: ensure DB entry exists
      await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          uid: user.uid,
          email: user.email ?? null,
          displayName: user.displayName ?? null,
          photoUrl: user.photoURL ?? null,
          providerId: user.providerData?.[0]?.providerId ?? null,
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Step 2: fetch backend truth
      const response = await axios.get(
        "http://localhost:8080/api/v1/user-information/me",
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      // Step 3: save backend truth in localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (err) {
      console.error("Signup sync failed:", err);
      alert("Signup failed, please try again.");
      return null;
    }
  };

  // Email/Password signup
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const backendUser = await syncWithBackend(result.user);
      if (backendUser) navigate("/profile");
    } catch (error) {
      console.error("Email Signup Error:", error.message);
      alert(error.message);
    }
  };

  // OAuth signup handlers
  const handleOAuthSignUp = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const backendUser = await syncWithBackend(result.user);
      if (backendUser) navigate("/profile");
    } catch (error) {
      console.error("OAuth Signup Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign Up</h2>

        <button className="btn google" onClick={() => handleOAuthSignUp(googleProvider)}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Sign up with Google
        </button>

        <button className="btn microsoft" onClick={() => handleOAuthSignUp(microsoftProvider)}>
          <img
            src="https://img.icons8.com/color/48/000000/microsoft.png"
            alt="Microsoft"
          />
          Sign up with Microsoft
        </button>

        <button className="btn github" onClick={() => handleOAuthSignUp(githubProvider)}>
          <img
            src="https://img.icons8.com/material-outlined/48/000000/github.png"
            alt="GitHub"
          />
          Sign up with GitHub
        </button>

        <button className="btn linkedin" onClick={() => handleOAuthSignUp(linkedinProvider)}>
          <img
            src="https://img.icons8.com/color/48/000000/linkedin.png"
            alt="LinkedIn"
          />
          Sign up with LinkedIn
        </button>

        <div className="divider">Or</div>

        <form onSubmit={handleEmailSignUp}>
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
          <button type="submit" className="btn primary">Sign Up</button>
        </form>

        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
