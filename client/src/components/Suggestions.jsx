import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Suggestions.css";

const Suggestions = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const response = await axios.get("http://localhost:6060/api/users", {
        withCredentials: true,
      });
      setUsers(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(
        "http://localhost:6060/api/follow",
        {
          userID: userId,
        },
        { withCredentials: true }
      );

      // Update the follow status in the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === userId ? { ...user, isFollowing: true } : user
        )
      );

      // Save the updated follow status to localStorage
      localStorage.setItem("followingStatus", JSON.stringify(users));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    // Retrieve the follow status from localStorage on component mount
    const savedFollowingStatus = localStorage.getItem("followingStatus");
    if (savedFollowingStatus) {
      setUsers(JSON.parse(savedFollowingStatus));
    }
  }, []);

  return (
    <div className="suggestions">
      <h2>Suggested Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.username}{" "}
            <button onClick={() => handleFollow(user.user_id)}>
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
