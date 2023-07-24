import React, { useState } from "react";
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
      const response = await axios.post(
        `http://localhost:6060/posts/${userId}/${post_id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update the likes state with the new like count
        setLikes((prevLikes) => ({
          ...prevLikes,
          [post_id]: response.data.totalLikes,
        }));
        // Update the userLiked state to reflect the user's like status
        setUserLiked((prevUserLiked) => ({
          ...prevUserLiked,
          [post_id]: !prevUserLiked[post_id],
        }));
      }
    } catch (error) {
      console.error("Error while liking/unliking post:", error);
    }
  };

  const handleCommentsToggle = (post_id) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [post_id]: !prevShowComments[post_id], // Toggle the visibility for the specific post_id
    }));
  };

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
                    {userLiked[item.post_id] ? "Unlike" : "Like"}{" "}
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
