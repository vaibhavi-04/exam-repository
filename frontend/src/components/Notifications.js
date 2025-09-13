import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const finalToken = token || localStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!finalToken) {
        console.error("finalToken is missing!!");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${finalToken}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [finalToken]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${finalToken}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center">No notifications yet.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start justify-between p-4 rounded-lg shadow-md mb-4 transition-all duration-300 ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              } hover:shadow-lg hover:scale-[1.02]`}
            >
              <div>
                <p className="text-gray-800">{notification.message}</p>
                {notification.questionPaperUrl && (
                  <a
                    href={notification.questionPaperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Question Paper
                  </a>
                )}
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
