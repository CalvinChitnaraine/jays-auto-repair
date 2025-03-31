import React, { useEffect, useState } from "react";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const imageOptions = ["profileimg1", "profileimg2", "profileimg3", "profileimg4", "profileimg5"];

useEffect(() => {
  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");

    
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setSelectedImage(data.profile_image);
      } else {
        console.error("Failed to fetch user info:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  fetchUserInfo();
}, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "Profile picture changes not saved. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleImageChange = (img) => {
    setSelectedImage(img);
    setUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
  
    try {
      // 1. Send PUT request to update profile image
      const response = await fetch("http://localhost:5000/users/profile-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_image: selectedImage }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
  
      // 2. Re-fetch updated user info
      const userRes = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = await userRes.json();
      if (!userRes.ok) throw new Error(updatedUser.error || "Failed to fetch updated user data");
  
      // 3. Update local state
      setUser(updatedUser);
      setSelectedImage(updatedUser.profile_image);
      setUnsavedChanges(false);
  
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Save error:", err.message);
      alert("Error updating profile picture.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        User <span className="highlight">Profile</span>
      </h2>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-img-section">
            <img
              src={`/images/profile_images/${selectedImage}.png`}
              alt="Profile"
              className="profile-img"
            />
            <button
              className="change-picture-toggle"
              onClick={() => setShowImageOptions(!showImageOptions)}
            >
              {showImageOptions ? "Hide Options" : "Change Picture"}
            </button>
          </div>

          {showImageOptions && (
            <>
              <div className="image-options">
                {imageOptions
                  .filter((img) => img !== selectedImage)
                  .map((img) => (
                    <img
                      key={img}
                      src={`/images/profile_images/${img}.png`}
                      alt={img}
                      className="thumbnail-img"
                      onClick={() => handleImageChange(img)}
                    />
                  ))}
              </div>
              
              {unsavedChanges && (
                <button className="save-changes-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              )}
            </>
          )}
        </div>

        <div className="info-card">
          <h3 className="info-heading">Account Details</h3>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;