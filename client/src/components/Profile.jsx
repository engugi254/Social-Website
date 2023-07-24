import "../styles/Profile.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);

  const [items3, setItems3] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response3 = await axios.get(
          `http://localhost:6060/${userId}/followers`,
          {
            withCredentials: true,
          }
        );
        setItems3(response3.data.followerCount);
        console.log(response3.data.followerCount);

        const response2 = await axios.get(
          `http://localhost:6060/${userId}/following`,
          {
            withCredentials: true,
          }
        );
        setItems2(response2.data.followingCount);
        console.log(response2.data.followingCount);
        const response = await axios.get(
          `http://localhost:4040/users/profile/${userId}`,
          {
            withCredentials: true,
          }
        );
        setItems(response.data.results);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="profile-container">
        <div key={items.user_id} className="cover-container">
          <img
            src={items.cover_pic_url}
            alt="Cover Image"
            className="cover-image"
          />
          <div className="profile-photo">
            <img
              src={items.profile_pic_url}
              alt="Profile Image"
              className="profile-image"
            />
          </div>
        </div>
      </div>
      <div className="profile-name">
        <p>
          <span className="first-name">{items.firstname}</span>
          <span className="last-name">{items.lastname}</span>
        </p>
        <p className="username">{items.username}</p>
      </div>
      <div className="profile-body">
        <p>
          <strong>Followers: </strong>
          {items3}{" "}
        </p>
        <p>
          <strong>Following: </strong>
          {items2}{" "}
        </p>
      </div>
      <div className="profile-bio">
        <h4>About me:</h4>
        <p>Relationship status: {items ? items.relationship_status : "N/A"}</p>
        <p>Address: {items ? items.address : "N/A"}</p>
        <p>Contact Number: {items ? items.contact_no : "N/A"}</p>
        <p>{items?.bio}</p>
      </div>

      {/* <p className="p-name">{console.log(items)}</p> */}
    </>
  );
};

export default Profile;
