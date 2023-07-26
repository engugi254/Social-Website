import React, { useState } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../styles/CoverPic.css";

function CoverPic({ userId }) {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [iconClicked, setIconClicked] = useState(false); // Track if the icon is clicked

  const handleImageUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "auvgkhsv");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj9ckjrdd/image/upload",
        formData
      );

      console.log("Image uploaded successfully!");
      setImageUrl(response.data.secure_url);
      console.log(response.data.secure_url);
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleIconClick = () => {
    // When the icon is clicked, set the iconClicked state to true
    setIconClicked(true);
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4040/users/update_profile",
        {
          user_id: userId,
          cover_pic_url: imageUrl.toString(),
        },
        { withCredentials: true }
      );

      console.log(userId);

      console.log("Image URL saved successfully!");
    } catch (error) {
      console.error("Error while saving image URL:", error);
    }
  };

  return (
    <div className="uploadForm">
      {/* Render the label and icon */}
      <label htmlFor="imageInput">
        <div className="uploadIcon" onClick={handleIconClick}>
          <FontAwesomeIcon icon={faUpload} size="2x" />
        </div>
      </label>

      {/* Render the file input conditionally based on whether the icon is clicked */}
      {iconClicked && (
        <form onSubmit={handleImageUpload}>
          <input
            type="file"
            id="imageInput"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit">Upload Image</button>
        </form>
      )}

      {imageUrl && (
        <div>
          <Image cloudName="dj9ckjrdd" publicId={imageUrl} />
          <button onClick={handleSaveImage}>Save Image</button>
        </div>
      )}
    </div>
  );
}

export default CoverPic;
