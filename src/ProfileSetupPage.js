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

  // ✅ Sync profile with backend using Base64
  const syncWithBackend = async (displayName, photoBase64) => {
    if (!auth.currentUser) return;
    const idToken = await auth.currentUser.getIdToken(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/user-information/update-user-info",
        {
          firstName,
          lastName,
          photoBase64: photoBase64 ?? null,
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/profile");
    } catch (err) {
      console.error("Profile setup sync failed:", err);
      alert("Could not save profile. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = `${firstName} ${lastName}`.trim();

    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => syncWithBackend(displayName, reader.result);
      reader.readAsDataURL(photo);
    } else {
      syncWithBackend(displayName, null);
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

          <label style={{ display: "block", marginBottom: "0.5rem" }}>
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
