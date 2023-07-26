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
import Suggestions from "./Suggestions";
import { NavLink } from "react-router-dom";

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
      const response = await axios.get(`http://localhost:4040/users`, {
        withCredentials: true,
      });
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
          <h2>
            Social<span className="hub">Hub</span>
          </h2>
        </div>
        <div>
          <input
            className="searchBar"
            type="text"
            placeholder="Search username"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch(); // Call handleSearch on every change in the input
            }}
          />

          {search !== "" && ( // Conditionally render the filtered user list if search is not empty
            <ul className="floating-list">
              {filteredUsers.length === 0 ? (
                <li>No username found</li>
              ) : (
                filteredUsers.map((user) => (
                  <NavLink key={user.user_id} to={`/${user.username}`}>
                    <li onClick={() => handleUserClick(user.username)}>
                      {user.username}
                    </li>
                  </NavLink>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="top-icons">
          <ul className="navbar4">
            <li className="left-panel-list">
              <NavLink
                exact
                to="/"
                className="left-panel-tags"
                activeClassName="active-link"
              >
                <FontAwesomeIcon icon={faHome} className="icon-top" />
              </NavLink>
            </li>
            <li className="left-panel-list">
              <NavLink
                to="/profile"
                className="left-panel-tags"
                activeClassName="active-link"
              >
                <FontAwesomeIcon icon={faUser} className="icon-top" />
              </NavLink>
            </li>
            <li className="left-panel-list">
              <NavLink
                to="/notification"
                className="left-panel-tags"
                activeClassName="active-link"
              >
                <FontAwesomeIcon icon={faBell} className="icon-top" />
              </NavLink>
            </li>
            <li className="left-panel-list">
              <NavLink
                to="/verified"
                className="left-panel-tags"
                activeClassName="active-link"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="icon-top" />
              </NavLink>
            </li>
            <li className="left-panel-list">
              <NavLink
                to="/settings"
                className="left-panel-tags"
                activeClassName="active-link"
              >
                <FontAwesomeIcon icon={faCog} className="icon-top" />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="home-main-container">
        <div className="home-container">
          <div className="left-panel">
            <div className="prof">
              <li key={item.post_id} className="post-item-profile">
                <div className="user-profile" onClick={toggleMenu}>
                  <div className="user-profile-image">
                    <img
                      src={item.profile_pic_url}
                      alt={item.profile_pic_url}
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
                    <Link to="/profile" className="left-panel-tags">
                      <span>View Profile</span>
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </div>
            <ul className="navbar">
              <li className="left-panel-list">
                <NavLink
                  exact
                  to="/"
                  className="left-panel-tags"
                  activeClassName="active-link"
                >
                  <FontAwesomeIcon icon={faHome} className="icon" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="left-panel-list">
                <NavLink
                  to="/profile"
                  className="left-panel-tags"
                  activeClassName="active-link"
                >
                  <FontAwesomeIcon icon={faUser} className="icon" />
                  <span>Profile</span>
                </NavLink>
              </li>
              <li className="left-panel-list">
                <NavLink
                  to="/notification"
                  className="left-panel-tags"
                  activeClassName="active-link"
                >
                  <FontAwesomeIcon icon={faBell} className="icon" />
                  <span>Notification</span>
                </NavLink>
              </li>
              <li className="left-panel-list">
                <NavLink
                  to="/verified"
                  className="left-panel-tags"
                  activeClassName="active-link"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                  <span>Verified</span>
                </NavLink>
              </li>
              <li className="left-panel-list">
                <NavLink
                  to="/settings"
                  className="left-panel-tags"
                  activeClassName="active-link"
                >
                  <FontAwesomeIcon icon={faCog} className="icon" />
                  <span>Settings</span>
                </NavLink>
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
            <h2>Trending </h2>
            {/* Rest of the component */}
            <div className="trending-posts">
              <p>#Trending Post 1</p>
              <p>#Trending Post 2</p>
              {/* ... and so on ... */}
            </div>

            <Suggestions />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
