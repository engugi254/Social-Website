import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./Home";
import "../styles/LandingPage.css";
import Cookies from "js-cookie";

import { toast } from "react-toastify";

function LandingPage() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const session = Cookies.get("session");
    if (session) {
      setLoggedIn(true);
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4040/users/login",
        {
          username: loginUsername,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store the session token in the cookie
        Cookies.set("session", response.data.token);

        const { userId } = response.data;
        localStorage.setItem("userId", userId);

        setUserId(userId);
        setLoggedIn(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error while logging in.");
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Perform registration validation here

    try {
      // Send registration data to the server
      await axios.post("http://localhost:4040/users/register", {
        firstname: registerFirstName,
        lastname: registerLastName,
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        c_password: confirmPassword,
      });

      console.log("Registered successfully!");
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Error while registering:", error);
      setError("Error while registering.");
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear the session token from the cookie and log the user out
      Cookies.remove("session");
      localStorage.removeItem("userId");

      setLoggedIn(false);
      setUserId("");
    } catch (error) {
      console.error("Error while logging out:", error);
      setError("Error while logging out.");
    }
  };

  if (loggedIn) {
    return <Home onLogout={handleLogout} userId={userId} />;
  }

  const handleRegisterLinkClick = () => {
    setShowLogin(false);
  };

  return (
    <div className="main-container">
      <div className="container">
        {registrationSuccess || showLogin ? (
          <form className="form" onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
            <p>
              Not registered?{" "}
              <span className="register-link" onClick={handleRegisterLinkClick}>
                Register
              </span>
            </p>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegisterSubmit}>
            <h2>Register</h2>
            <input
              type="text"
              value={registerFirstName}
              onChange={(e) => setRegisterFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={registerLastName}
              onChange={(e) => setRegisterLastName(e.target.value)}
              placeholder="Last Name"
            />
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <button type="submit">Register</button>
            <p>
              Already registered?{" "}
              <span
                className="register-link"
                onClick={() => setShowLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default LandingPage;
