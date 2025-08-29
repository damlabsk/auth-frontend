import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("✅ Loaded user:", parsed);

      // unify fields (support both signup flows)
      const firstName =
        parsed.firstName ??
        (parsed.displayName ? parsed.displayName.split(" ")[0] : "");
      const lastName =
        parsed.lastName ??
        (parsed.displayName
          ? parsed.displayName.split(" ").slice(1).join(" ")
          : "");
      const photo = parsed.photo ?? parsed.photoUrl ?? null;

      setUser({
        firstName,
        lastName,
        photo,
        email: parsed.email ?? null,
        uid: parsed.uid ?? null,
      });

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

  const handleSave = (e) => {
    e.preventDefault();

    if (newPhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = {
          ...user,
          firstName: newFirstName,
          lastName: newLastName,
          photo: reader.result,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      };
      reader.readAsDataURL(newPhoto);
    } else {
      const updatedUser = {
        ...user,
        firstName: newFirstName,
        lastName: newLastName,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
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
            src={user.photo || "https://via.placeholder.com/120"}
            alt="Profile"
          />
        </div>
        <div className="profile-info">
          <h2>
            {user.firstName} {user.lastName}
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
