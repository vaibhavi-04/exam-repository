// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from "../context/AuthContext";
// import '../styles/Profile.css';

// const ProfilePage = () => {
//   const { user } = useContext(AuthContext);

//   const [profile, setProfile] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('No token found');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.error('Error fetching profile', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchProfile();
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   // Fetch courses
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/api/courses/all');
//         setCourses(res.data);
//       } catch (err) {
//         console.error('Error fetching courses', err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Get course names for the user's current courses
  
//   const getCourseNames = () => {
//     if (!profile?.currentCourses?.length) return "No courses enrolled";
//     return profile.currentCourses.map(course => course.name).join(", ");
// };

//   // Loading State
//   if (loading || !profile || courses.length === 0) {
//     return <div>Loading profile...</div>;
//   }

//   // Render
//   return (
//     <div className="profile-container">
//       <h2>Welcome, {profile.name || "User"}!</h2>
//       <div className="profile-info">
//         <p><strong>Admission Number:</strong> {profile.admissionNumber || "Not set"}</p>
//         <p><strong>Email:</strong> {profile.email || "Not set"}</p>
//         <p><strong>Semester:</strong> {profile.semester || "Not set"}</p>
//         <p><strong>Passing Year:</strong> {profile.passingYear || "Not set"}</p>
//         <p><strong>Branch:</strong> {profile.branch || "Not set"}</p>
//         <p><strong>Current Courses:</strong> {getCourseNames()}</p>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getCourseNames = () => {
    if (!profile?.currentCourses?.length) return "No courses enrolled";
    return profile.currentCourses.map((c) => c.name).join(", ");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-heading">Welcome, {profile.name}!</h2>
        <div className="profile-info">
          <p><strong>Admission Number:</strong> {profile.admissionNumber}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Semester:</strong> {profile.semester}</p>
          <p><strong>Branch:</strong> {profile.branch}</p>
          <p><strong>Current Courses:</strong> {getCourseNames()}</p>
          <p><strong>Credit points:</strong> {profile.credits}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
