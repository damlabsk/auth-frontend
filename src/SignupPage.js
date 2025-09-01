import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, githubProvider, linkedinProvider, microsoftProvider } from "./firebase";
import axios from "axios";
import "./LoginPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // For signup, call /register
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

    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/register",
      body,
      { headers: { Authorization: `Bearer ${idToken}` } }
    );

    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

    const mergedUser = {
      ...response.data, // backend truth
      ...existingUser,
      uid: response.data.uid ?? existingUser.uid ?? user.uid,
      email: response.data.email ?? existingUser.email ?? user.email ?? null,
      provider:
        response.data.provider ??
        existingUser.provider ??
        user.providerData?.[0]?.providerId ??
        null,
      displayName:
        user.displayName ||
        response.data.displayName ||
        existingUser.displayName ||
        null,
      firstName:
        existingUser.firstName || response.data.firstName || null,
      lastName:
        existingUser.lastName || response.data.lastName || null,
      photoUrl:
        user.photoURL ||
        response.data.photoUrl ||
        existingUser.photoUrl ||
        null,
    };

    localStorage.setItem("user", JSON.stringify(mergedUser));
  };

  // Email/Password signup
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await syncWithBackend(result.user);
      // Collect name/photo next
      navigate("/profile-setup");
    } catch (error) {
      console.error("Email Signup Error:", error.message);
      alert(error.message);
    }
  };

  // OAuth signups
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncWithBackend(result.user);
      navigate("/profile");
    } catch (error) {
      console.error("Google Signup Error:", error);
    }
  };

  const handleMicrosoftSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      await syncWithBackend(result.user);
      navigate("/profile");
    } catch (error) {
      console.error("Microsoft Signup Error:", error);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await syncWithBackend(result.user);
      navigate("/profile");
    } catch (error) {
      console.error("GitHub Signup Error:", error);
    }
  };

  const handleLinkedInSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, linkedinProvider);
      await syncWithBackend(result.user);
      navigate("/profile");
    } catch (error) {
      console.error("LinkedIn Signup Error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign Up</h2>

        <button className="btn google" onClick={handleGoogleSignUp}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign up with Google
        </button>

        <button className="btn microsoft" onClick={handleMicrosoftSignUp}>
          <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="Microsoft" />
          Sign up with Microsoft
        </button>

        <button className="btn github" onClick={handleGithubSignUp}>
          <img src="https://img.icons8.com/material-outlined/48/000000/github.png" alt="GitHub" />
          Sign up with GitHub
        </button>

        <button className="btn linkedin" onClick={handleLinkedInSignUp}>
          <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" />
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