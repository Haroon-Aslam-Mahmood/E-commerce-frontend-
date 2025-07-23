import React, { useState } from "react";
import ProfileDashboard from "../ProfileDashboard/ProfileDashboard";
import { useCart } from "../../context/CartContext";
import "./ProfileIcon.css";

const ProfileIcon = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user } = useCart();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
      <div className="profile-icon-container" onClick={toggleProfile}>
        <div className="profile-icon">
          {isAuthenticated ? (
            <div className="user-avatar-small">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M12 14C7.029 14 3 18.029 3 23H21C21 18.029 16.971 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      </div>
      <ProfileDashboard isOpen={isProfileOpen} onClose={closeProfile} />
    </>
  );
};

export default ProfileIcon;
