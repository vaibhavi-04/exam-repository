
// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "../styles/Navbar.css"; 

// const Navbar = ({ setShowLogin, setShowSignup }) => {
//   const { isLoggedIn, logout } = useContext(AuthContext);

//   return (
//     <nav className="navbar">
//       <h1 className="navbar-title">Exam Archive</h1>
//       <div className="navbar-links">
//         <Link to="/upload">Upload</Link>
//         <Link to="/searchQuestion">Search</Link>
//         <Link to="/notifications">Notifications</Link>
        


//         {isLoggedIn ? (
//           <>
//             <Link to="/profile">Profile</Link>
//             <button onClick={logout} className="navbar-button logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <button className="navbar-button" onClick={() => setShowLogin(true)}>Login</button>
//             <button className="navbar-button" onClick={() => setShowSignup(true)}>Signup</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Bell } from "lucide-react";  
import "../styles/Navbar.css";

const Navbar = ({ setShowLogin, setShowSignup }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    };

    fetchUnreadNotifications();
  }, [token]);

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Exam Archive</h1>
      <div className="navbar-links">
        <Link to="/upload">Upload</Link>
        <Link to="/searchQuestion">Search</Link>
        <Link to="/questionPaperArchive">Archive</Link>
        <Link to="/filter" >Search Paper </Link>

        {/* 🔔 Notification Bell with Unread Count */}
        {isLoggedIn && (
          <div className="notification-container" onClick={() => navigate("/notifications")}>
            <Bell className="notification-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="navbar-button logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="navbar-button" onClick={() => setShowLogin(true)}>Login</button>
            <button className="navbar-button" onClick={() => setShowSignup(true)}>Signup</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
