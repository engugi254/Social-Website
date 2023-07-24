import React, { useState, useEffect } from "react";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faComment,
  faThumbsUp,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Comment from "./Comments"; // Import the Comment component

const Post = ({ items, userId }) => {
  const [likes, setLikes] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const [showComments, setShowComments] = useState({}); // State to manage comments toggle

  console.log(userId);
  library.add(faComment, faThumbsUp, faShare);

  const handleLikeToggle = async (post_id) => {
    try {
      // Check if the user already liked the post
      if (userLiked[post_id]) {
        // If the user already liked the post, unlike the post
        const response = await axios.post(
          "http://localhost:5050/unlike-post",
          { post_id: post_id, user_id: userId },
          { withCredentials: true }
        );

        if (response.data.success) {
          // If the like is successfully removed, update the likes and userLiked states
          setLikes((prevLikes) => ({
            ...prevLikes,
            [post_id]: prevLikes[post_id] - 1,
          }));
          setUserLiked((prevUserLiked) => ({
            ...prevUserLiked,
            [post_id]: false,
          }));
          // Remove the post_id from localStorage to persist the unlike action across refreshes
          localStorage.removeItem(`userLiked:${userId}:${post_id}`);
        }
      } else {
        // If the user has not liked the post, like the post
        const response = await axios.post(
          "http://localhost:5050/like-post",
          { user_id: userId, post_id: post_id },
          { withCredentials: true }
        );
        if (response.data.success) {
          // If the like is successfully added, update the likes and userLiked states
          setLikes((prevLikes) => ({
            ...prevLikes,
            [post_id]: (prevLikes[post_id] || 0) + 1,
          }));
          setUserLiked((prevUserLiked) => ({
            ...prevUserLiked,
            [post_id]: true,
          }));
          // Save the post_id to localStorage to persist the like action across refreshes
          localStorage.setItem(`userLiked:${userId}:${post_id}`, true);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentsToggle = (post_id) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [post_id]: !prevShowComments[post_id], // Toggle the visibility for the specific post_id
    }));
  };

  // Function to fetch the total likes for each post on page load
  const fetchTotalLikes = async () => {
    try {
      const response = await axios.get("http://localhost:5050/total-likes", {
        withCredentials: true,
      });
      const totalLikesData = response.data;

      // Update the likes state with the retrieved total likes
      const likesData = {};
      const userLikedData = {};

      totalLikesData.forEach((data) => {
        likesData[data.post_id] = data.total_likes;
        // Check if the post_id is saved in localStorage to determine if the user has liked the post
        userLikedData[data.post_id] =
          localStorage.getItem(`userLiked:${userId}:${data.post_id}`) ===
          "true";
      });

      setLikes(likesData);
      setUserLiked(userLikedData);
    } catch (error) {
      console.error("Error fetching total likes:", error);
    }
  };

  useEffect(() => {
    // Fetch total likes on page load
    fetchTotalLikes();
  }, [userId]); // Fetch total likes whenever the userId changes

  return (
    <div>
      {items.length === 0 ? ( // Check if there are no items and display "Loading..." if true
        <div className="loading-div">Loading...</div>
      ) : (
        <ul className="post-list">
          {items.map((item) => (
            <li key={item.post_id} className="post-item">
              <div className="user-profile">
                <img
                  src={item.user.profile.profile_pic_url}
                  alt={item.user.profile.profile_pic_url}
                  className="profile-picture"
                />
                <span className="username">{item.user.username}</span>
              </div>
              <div className="post-content-wrapper">
                <h3 className="post-content">{item.post_content}</h3>
                <img
                  src={item.post_image}
                  alt={item.post_image}
                  className="post-image"
                />
                <div className="post-icons">
                  <span className="like-icon">
                    <FontAwesomeIcon icon="comment" className="light-icon" />{" "}
                  </span>
                  <span
                    className="light-icon-content"
                    onClick={() => handleCommentsToggle(item.post_id)} // Use the local handleCommentsToggle in the Post component
                  >
                    {showComments[item.post_id]
                      ? "Hide Comments"
                      : "Show Comments"}
                  </span>

                  <span className="like-icon">
                    <FontAwesomeIcon icon="thumbs-up" className="light-icon" />
                  </span>
                  <span
                    className="light-icon-content"
                    onClick={() => handleLikeToggle(item.post_id)}
                  >
                    <span className="like-count">
                      {likes[item.post_id] || 0}{" "}
                      {/* Display the like count for the post */}
                    </span>
                    {userLiked[item.post_id] ? "Unlike" : "Likes"}{" "}
                  </span>

                  <span className="share-icon">
                    <FontAwesomeIcon icon="share" className="light-icon" />
                  </span>
                  <span className="light-icon-content">Share</span>
                </div>
              </div>
              <Comment
                items={items}
                post_id={item.post_id}
                showComments={showComments}
                userId={userId}
              />{" "}
              {/* Pass the userId as a prop */}
              {/* Pass the showComments for the specific post as a prop */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Post;
