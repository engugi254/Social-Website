import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserData = ({ username }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/users/${username}`
        );
        setUserData(response.data.results);
        console.log(userData);
      } catch (error) {
        toast.error("An error occurred: " + error.message);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{userData[0].username}</h2>
      <p>Email: {userData[0].email}</p>
      {/* Display other user data as needed */}
    </div>
  );
};

export default UserData;
