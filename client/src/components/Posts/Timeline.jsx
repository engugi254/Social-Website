import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Timeline.css";

import Share from "./Share.jsx";
import Post from "./Post.jsx";

const Timeline = ({ userId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5050/pCR", {
          withCredentials: true,
        });
        setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <div className="timeline-container">
        <Share id={userId} />
        <Post
          items={items}
          userId={userId}
        /> {/* Pass the userId as a prop */}{" "}
        {/* Pass the showComments and handleCommentsToggle as props */}
        {/* Pass the handleCommentsToggle function as a prop */}
      </div>
    </div>
  );
};

export default Timeline;
