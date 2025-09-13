import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AuthModal.css";
import { AuthContext } from "../context/AuthContext";
import Select from "react-select";

// Branch Options
const branchOptions = [
  { value: "CSE", label: "Computer Science" },
  { value: "ECE", label: "Electronics and Communication" },
  { value: "EEE", label: "Electrical and Electronics" },
  { value: "ME", label: "Mechanical" },
  { value: "CE", label: "Civil" },
];

const AuthModal = ({ showLogin, showSignup, setShowLogin, setShowSignup }) => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/all");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  // Auto focus on first input when modal opens
  useEffect(() => {
    if (showLogin || showSignup) firstInputRef.current?.focus();
  }, [showLogin, showSignup]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    admissionNumber: "",
    semester: "",
    branch: "",
    currentCourses: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input
  };

  const handleBranchChange = (selectedOption) => {
    setFormData({ ...formData, branch: selectedOption?.value || "" });
  };

  const handleCoursesChange = (selectedOptions) => {
    const selectedCourses = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setFormData({ ...formData, currentCourses: selectedCourses });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      setShowLogin(false);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branch || formData.currentCourses.length === 0) {
      setError("Please select your branch and at least one course.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        admissionNumber: formData.admissionNumber,
        semester: formData.semester,
        branch: formData.branch,
        currentCourses: formData.currentCourses,
      });
      alert(res.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
        admissionNumber: "",
        semester: "",
        branch: "",
        currentCourses: [],
      });
      setShowSignup(false);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Login</h2>
            {error && <p className="modal-error">{error}</p>}
            <form onSubmit={handleLoginSubmit}>
              <input ref={firstInputRef} type="email" name="email" placeholder="Email" className="modal-input" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" className="modal-input" value={formData.password} onChange={handleChange} required />
              <button type="submit" className="modal-button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            </form>
            <p className="modal-footer">
              Don't have an account?{" "}
              <button onClick={() => { setShowSignup(true); setShowLogin(false); }} className="text-link">Sign up here</button>
            </p>
            <button onClick={() => setShowLogin(false)} className="modal-close">✕</button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal-overlay">
          <div className="modal-container scrollable-modal">
            <h2 className="modal-title">Sign Up</h2>
            {error && <p className="modal-error">{error}</p>}
            <form onSubmit={handleSignupSubmit}>
              <input ref={firstInputRef} type="text" name="username" placeholder="Full Name" className="modal-input" value={formData.username} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" className="modal-input" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" className="modal-input" value={formData.password} onChange={handleChange} required />
              <input type="text" name="admissionNumber" placeholder="Admission Number" className="modal-input" value={formData.admissionNumber} onChange={handleChange} required />
              <input type="text" name="semester" placeholder="Semester (e.g., 6th)" className="modal-input" value={formData.semester} onChange={handleChange} required />

              {/* Branch Single Select */}
              <label className="modal-label">Select Branch:</label>
              <Select
                options={branchOptions}
                onChange={handleBranchChange}
                placeholder="Select Branch"
                isClearable
              />

              {/* Courses Multi Select */}
              <label className="modal-label">Select Courses:</label>
              <Select
                options={courses.map(course => ({ value: course._id, label: course.name }))}
                isMulti
                onChange={handleCoursesChange}
                placeholder="Select Courses"
              />

              <button type="submit" className="modal-button" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
            </form>
            <p className="modal-footer">
              Already have an account?{" "}
              <button onClick={() => { setShowLogin(true); setShowSignup(false); }} className="text-link">Login here</button>
            </p>
            <button onClick={() => setShowSignup(false)} className="modal-close">✕</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
