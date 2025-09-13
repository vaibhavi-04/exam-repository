import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications"; // Adjust if needed

export const fetchNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data.notifications; // Ensure backend returns `{ notifications: [...] }`
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
