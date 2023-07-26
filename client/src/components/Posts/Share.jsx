// Share.jsx
import React, { useState } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";

const Share = ({ id }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "auvgkhsv");

    try {
      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dj9ckjrdd/image/upload",
        formData
      );

      console.log("Image uploaded successfully!");
      setImageUrl(uploadResponse.data.secure_url);

      const saveResponse = await axios.post(
        "http://localhost:5050/posts",
        {
          user_id: id,
          content: content,
          image: uploadResponse.data.secure_url,
        },
        { withCredentials: true }
      );
      console.log(uploadResponse.data.secure_url);
      console.log("Image URL and content saved successfully!");

      // Resetting the imageUrl and image states
      setImageUrl("");
      setImage(null);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error while uploading and saving image:", error);
    }
  };

  return (
    <div className="post-container">
      <form className="post-form" onSubmit={handleImageUpload}>
        <span className="sharePost">
          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
          />
          <button className="post-submit-btn" type="submit">
            Share
          </button>
        </span>
        <input
          className="post-file-input"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </form>

      {imageUrl && (
        <div className="post-image-container">
          <Image
            className="post-image"
            cloudName="dj9ckjrdd"
            publicId={imageUrl}
          />
        </div>
      )}
    </div>
  );
};

export default Share;
