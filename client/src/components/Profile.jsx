import "../styles/Profile.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CoverPic from "./CoverPic";
import MyPost from "./MyPost";

const Profile = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);

  const [items3, setItems3] = useState([]);
  const [posts, setPosts] = useState([]);

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
        console.log(response2);
        const response = await axios.get(
          `http://localhost:4040/users/profile/${userId}`,
          {
            withCredentials: true,
          }
        );
        setItems(response.data.results);
        console.log(response.data.results);

        const response4 = await axios.get(
          `http://localhost:5050/postcomments/user`,
          {
            withCredentials: true,
          }
        );
        setPosts(response4.data);
        console.log(response4.data);
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
          <CoverPic userId={userId} />
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
        <p className="username">@{items.username}</p>
      </div>
      <div className="profile-body">
        <div>
          <span>
            <strong>Followers: </strong>
            {items3}{" "}
          </span>
        </div>
        <div>
          <span>
            <strong>Followers: </strong>
            {items3}{" "}
          </span>
        </div>
      </div>
      <div className="profile-bio">
        <h4>About me:</h4>
        <p>Relationship status: {items ? items.relationship_status : "N/A"}</p>
        <p>Address: {items ? items.address : "N/A"}</p>
        <p>Contact Number: {items ? items.contact_no : "N/A"}</p>
        <p>{items?.bio}</p>
      </div>
      <h3>My posts</h3>
      <MyPost posts={posts} userId={userId} />

      {/* <p className="p-name">{console.log(items)}</p> */}
    </>
  );
};

export default Profile;
