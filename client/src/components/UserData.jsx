import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CoverPic from "./CoverPic";

const UserData = ({ username }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/users/${username}`,
          { withCredentials: true }
        );
        setUserData(response.data.results);
        console.log(response);
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
    <>
      <div className="profile-container">
        <div key={userData[0].user_id} className="cover-container">
          <img
            src={userData[0].cover_pic_url}
            alt="Cover Image"
            className="cover-image"
          />
          <CoverPic userId={userData[0].user_id} />
          <div className="profile-photo">
            <img
              src={userData[0].profile_pic_url}
              alt="Profile Image"
              className="profile-image"
            />
          </div>
        </div>
      </div>
      <div className="profile-name">
        <p>
          <span className="first-name">{userData[0].firstname}</span>
          <span className="last-name">{userData[0].lastname}</span>
        </p>
        <p className="username">{userData[0].username}</p>
      </div>
      <div className="profile-body">
        <p>
          <strong>Followers: </strong>
        </p>
        <p>
          <strong>Following: </strong>
        </p>
      </div>
      <div className="profile-bio">
        <h4>About me:</h4>
        <p>
          Relationship status:{" "}
          {userData[0] ? userData[0].relationship_status : "N/A"}
        </p>
        <p>Address: {userData[0] ? userData[0].address : "N/A"}</p>
        <p>Contact Number: {userData[0] ? userData[0].contact_no : "N/A"}</p>
        <p>{userData[0]?.bio}</p>
      </div>
      <div className="contacts">
        <h4>Contacts:</h4>
        <p>Email : {userData[0] ? userData[0].email : "N/A"}</p>

        <p>Contact Number: {userData[0] ? userData[0].contact_no : "N/A"}</p>
      </div>
    </>
  );
};

export default UserData;
