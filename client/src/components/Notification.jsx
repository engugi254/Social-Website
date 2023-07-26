import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Notification.css";

const Notification = ({ userId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6060/${userId}/notifications`,
          {
            withCredentials: true,
          }
        );
        const reversedItems = response.data.results.reverse();
        setItems(reversedItems);

        console.log(reversedItems);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Call your API to update the notification as read
      await axios.post(
        `http://localhost:6060/${notificationId}/notifications/read`,
        {
          notification_id: notificationId,
        },
        {
          withCredentials: true,
        }
      );

      // Update the local state to mark the notification as read
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.notification_id === notificationId
            ? { ...item, is_read: true }
            : item
        )
      );

      // Save the read notification ID to local storage
      localStorage.setItem(`read_${notificationId}`, "true");
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  useEffect(() => {
    // Check local storage on component mount to update the read status of notifications
    const updatedItems = items.map((item) => {
      const isRead = localStorage.getItem(`read_${item.notification_id}`);
      return isRead ? { ...item, is_read: true } : item;
    });

    setItems(updatedItems);
  }, []); // Add an empty dependency array here to run the effect only once

  return (
    <div className="notification-container">
      <ul className="notification-list">
        {items.map((notification) => (
          <li
            key={notification.notification_id}
            className={`notification-item ${
              notification.is_read ? "read faded" : "unread"
            }`}
          >
            <div className="notification-content">
              <h3 className="notification-title">{notification.type}</h3>
              <p className="notification-description">
                You have received a {notification.type} from{" "}
                {notification.sender_username}
              </p>
              {!notification.is_read && (
                <button
                  className="mark-as-read-btn"
                  onClick={() => handleMarkAsRead(notification.notification_id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
