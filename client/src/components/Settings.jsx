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

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  const handleDeleteAccount = async () => {
    try {
      // Make API call to delete the account using the user_id or any other identifier
      const response = await axios.delete(
        `http://localhost:4040/users/delete_account/${userId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Account deleted successfully!");
      console.log(response.data.results); // This could be a success message or any other response from the backend
      // Optionally, you can perform any cleanup actions or redirect the user after successful deletion
    } catch (error) {
      toast.error(
        "An error occurred while deleting the account: " + error.message
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className="update-details">Update Your Details:</h3>
      <br></br>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className="formGroup">
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
        <div className="formGroup">
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
        <div className="formGroup">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
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
        <div className="formGroup">
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
        <p>
          <button type="submit">Submit</button>
        </p>
        <div className="deleteDiv">
          <h3>Delete Account: </h3>
          <button
            type="button"
            className="delete-button"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            Delete Account
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete your account?</p>
          <button onClick={handleDeleteAccount}>Yes</button>
          <br />
          <button onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
