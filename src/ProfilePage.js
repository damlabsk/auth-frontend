import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      const firstName =
        parsed.displayName?.split(" ")[0] || parsed.firstName || "";
      const lastName =
        parsed.displayName?.split(" ").slice(1).join(" ") ||
        parsed.lastName ||
        "";

      setUser(parsed);
      setNewFirstName(firstName);
      setNewLastName(lastName);
    } else {
      navigate("/profile-setup");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const idToken = await currentUser.getIdToken(true);

    let photoBase64 = user?.photoBase64 || null;

    if (newPhoto) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        photoBase64 = reader.result;
        await saveProfile(photoBase64, idToken);
      };
      reader.readAsDataURL(newPhoto);
    } else {
      await saveProfile(photoBase64, idToken);
    }
  };

  const saveProfile = async (photoBase64, idToken) => {
    try {
      const payload = {
        firstName: newFirstName,
        lastName: newLastName,
        photoBase64,
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/user-information/update-user-info",
        payload,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      const updatedUser = response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Could not update profile, please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Topbar */}
      <div className="topbar">
        <div className="search-section">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <div className="topbar-right">
          <button className="topbar-btn" onClick={() => navigate("/profile")}>
            Profilim
          </button>
          <button className="topbar-btn logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Profile content */}
      <div className="profile-content">
        <div className="profile-photo">
          <img
            src={user.photoBase64 || "https://via.placeholder.com/120"}
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <h2>
            {user.displayName || `${newFirstName} ${newLastName}`}
            <span className="edit-btn" onClick={() => setIsEditing(true)}>
              Düzenle ✏️
            </span>
          </h2>
          <p>Hoşgeldin, profil sayfana girdin!</p>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fab">+</button>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Profili Düzenle</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhoto(e.target.files[0])}
              />
              <div className="modal-actions">
                <button type="submit" className="btn primary">
                  Kaydet
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() => setIsEditing(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
