import React from "react";
import "../styles/Home.css";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Settings from "./Settings";
import Profile from "./Profile";
import Messages from "./Messages";
import Notification from "./Notification";
import Timeline from "./Posts/Timeline";
import Verified from "./Verified";
import UserData from "./userData";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCog,
  faBell,
  faCheckCircle,
  faEnvelope,
  faBookmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Home = (props) => {
  const { userId, onLogout } = props;
  const [item, setItems] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user

  useEffect(() => {
    // Filter the users based on the search input whenever the 'search' state changes
    if (search === "") {
      setFilteredUsers([]); // Clear the filtered list when search is empty
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
      console.log(filteredUsers);
    }
  }, [search, users]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:4040/users");
      setUsers(response.data.results);
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleUserClick = (username) => {
    setSelectedUser(username);
    setSearch("");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/users/profile/${userId}`,
          {
            withCredentials: true,
          }
        );
        setItems(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        toast.error("An error occurred: " + error.message);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      <div className="top-panel">
        <div className="header-name">
          <h2>SocialHub</h2>
        </div>
      </div>

      <div className="home-container">
        <div className="left-panel">
          <div className="prof">
            <li key={item.post_id} className="post-item-profile">
              <div className="user-profile" onClick={toggleMenu}>
                <div className="user-profile-image">
                  <img
                    src={item.profile_pic_url}
                    alt={item.username}
                    className="profile-picture"
                  />
                </div>
                <div>
                  <span className="firstname">{item.firstname}</span>
                  <span className="lastname">{item.lastname}</span>

                  <p>
                    <span className="username">@{item.username}</span>
                  </p>
                </div>
              </div>
              {isMenuOpen && (
                <div>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </li>
          </div>
          <ul className="navbar">
            <li className="left-panel-list">
              <Link to="/" className="left-panel-tags">
                <FontAwesomeIcon icon={faHome} className="icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className="left-panel-list">
              <Link to="/profile" className="left-panel-tags">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li className="left-panel-list">
              <Link to="/notification" className="left-panel-tags">
                <FontAwesomeIcon icon={faBell} className="icon" />
                <span>Notification</span>
              </Link>
            </li>
            <li className="left-panel-list">
              <Link to="/verified" className="left-panel-tags">
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                <span>Verified</span>
              </Link>
            </li>
            <li className="left-panel-list">
              <Link to="/messages" className="left-panel-tags">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <span>Messages</span>
              </Link>
            </li>
            <li className="left-panel-list">
              <Link to="/settings" className="left-panel-tags">
                <FontAwesomeIcon icon={faCog} className="icon" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="main-panel">
          <Routes>
            <Route path="/" element={<Timeline userId={userId} />} />
            <Route
              path="/notification"
              element={<Notification userId={userId} />}
            />
            <Route path="/messages" element={<Messages userId={userId} />} />
            <Route path="/verified" element={<Verified userId={userId} />} />
            <Route path="/settings" element={<Settings userId={userId} />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
            <Route
              path="/:username"
              element={<UserData username={selectedUser} />}
            />
          </Routes>
        </div>
        <div className="right-panel">
          <input
            type="text"
            placeholder="Search username"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch(); // Call handleSearch on every change in the input
            }}
          />
          <div>
            {search !== "" && ( // Conditionally render the filtered user list if search is not empty
              <ul className="floating-list">
                {filteredUsers.length === 0 ? (
                  <li>No username found</li>
                ) : (
                  filteredUsers.map((user) => (
                    <Link key={user.user_id} to={`/${user.username}`}>
                      <li onClick={() => handleUserClick(user.username)}>
                        {user.username}
                      </li>
                    </Link>
                  ))
                )}
              </ul>
            )}
          </div>
          <h2>Trending Posts</h2>
          {/* Rest of the component */}
          <div className="trending-posts">
            <p>Trending Post 1</p>
            <p>Trending Post 2</p>
            {/* ... and so on ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
