import React from "react";
import "./RedirectedPage.css";

const RedirectedPage = ({ onLogout }) => {
  const handleLogout = () => {
    // Call the onLogout function passed from the parent component
    onLogout();
  };

  return (
    <div className="redirected-container">
      <h2>Welcome to the redirected page!</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default RedirectedPage;
