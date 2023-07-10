import React, { useState } from "react";
import "./App.css";

function App() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Perform login validation here

    // Example validation: check if username and password are not empty
    if (loginUsername === "" || loginPassword === "") {
      setError("Please enter both username and password.");
    } else {
      // Perform login logic here
      console.log("Logged in successfully!");
      // Redirect to the dashboard or another page
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Perform registration validation here

    // Example validation: check if all fields are not empty
    if (
      registerUsername === "" ||
      registerEmail === "" ||
      registerPassword === ""
    ) {
      setError("Please fill in all fields.");
    } else {
      // Perform registration logic here
      console.log("Registered successfully!");
      // Show success message or redirect to login page
    }
  };

  return (
    <div className="container">
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
      </form>
      <form className="form" onSubmit={handleRegisterSubmit}>
        <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
