// import { useState, useEffect } from "react";
// import axios from "axios";

// const Notifications = ({ token }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/notifications", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotifications(res.data);
//         setUnreadCount(res.data.filter((n) => !n.isRead).length);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       }
//     };
//     fetchNotifications();
//   }, [token]);

//   const markAsRead = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/notifications/${id}/mark-read`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
//       );
//       setUnreadCount((prev) => prev - 1);
//     } catch (err) {
//       console.error("Error marking notification as read:", err);
//     }
//   };

//   return (
//     <div className="relative">
//       <button className="relative bg-gray-800 text-white px-3 py-2 rounded-full">
//         🔔 {unreadCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">{unreadCount}</span>}
//       </button>

//       <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md">
//         {notifications.length === 0 ? (
//           <p className="p-2 text-gray-500">No notifications</p>
//         ) : (
//           notifications.map((notification) => (
//             <div key={notification._id} className={`p-2 border-b ${notification.isRead ? "bg-gray-100" : "bg-blue-100"}`}>
//               <p>{notification.message}</p>
//               {!notification.isRead && (
//                 <button onClick={() => markAsRead(notification._id)} className="text-blue-500 text-xs">Mark as read</button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;
