import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/SettingsPage.css";
import { toast } from "react-toastify";

const Settings = ({ userId }) => {
  const [formData, setFormData] = useState({
    user_id: userId,
    contact_no: "",
    address: "",
    bio: "",
    relationship_status: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4040/users/update_profile",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("Profile saved successfully!");
      console.log(response.data.results); // This could be an ID or any other response from the backend
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };
  return (
    <div className={styles.formContainer}>
      <h3 className="update-details">Update Your Details:</h3>
      <br></br>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="contact_no">Contact Number</label>
          <input
            type="text"
            id="contact_no"
            name="contact_no"
            value={formData.contact_no}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="relationship_status">Relationship Status</label>
          <input
            type="text"
            id="relationship_status"
            name="relationship_status"
            value={formData.relationship_status}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default Settings;
