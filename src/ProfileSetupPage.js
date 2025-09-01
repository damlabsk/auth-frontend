import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import "./LoginPage.css";

function ProfileSetupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const saveProfile = async (base64Photo) => {
      const displayName = `${firstName} ${lastName}`.trim();

      // Prepare payload for backend
      const profileData = {
        displayName,
        photoUrl: base64Photo,
        firstName,
        lastName,
      };

      try {
        const idToken = await auth.currentUser.getIdToken(true);

        // Persist to backend (register/update)
        await axios.post("http://localhost:8080/api/v1/auth/register", profileData, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        console.error("Profile setup sync failed:", err);
      }

      // Store locally as well (normalized keys)
      const user = auth.currentUser;
      const localUser = {
        uid: user?.uid ?? null,
        email: user?.email ?? null,
        provider: user?.providerData?.[0]?.providerId ?? null,
        firstName,
        lastName,
        displayName,
        photoUrl: base64Photo ?? null,
      };
      localStorage.setItem("user", JSON.stringify(localUser));

      navigate("/profile");
    };

    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => saveProfile(reader.result);
      reader.readAsDataURL(photo);
    } else {
      saveProfile(null);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#555",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            Profile Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          <button type="submit" className="btn primary" style={{ marginTop: "1rem" }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupPage;