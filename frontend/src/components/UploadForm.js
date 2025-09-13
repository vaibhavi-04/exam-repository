import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Hardcoded Branches
const branchOptions = [
  { value: "CSE", label: "Computer Science" },
  { value: "ECE", label: "Electronics and Communication" },
  { value: "EEE", label: "Electrical and Electronics" },
  { value: "ME", label: "Mechanical" },
  { value: "CE", label: "Civil" },
];


// ✅ Hardcoded Paper Types
const paperTypes = [
  { value: "midsem", label: "Mid-Semester" },
  { value: "endsem", label: "End-Semester" },
  { value: "quiz-1", label: "Quiz 1" },
  { value: "quiz-2", label: "Quiz 2" },
  { value: "other", label: "Other" },
];


const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    year: "",
    department: "",
    courseId: "",
    type: "", // ✅ Added type field
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/all");
        setAvailableCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Upload Handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !metadata.courseId || !metadata.department) {
      return alert("Please select a file, course, and department.");
    }

    const token = localStorage.getItem("token"); // <-- get token

    if (!token) {
      return alert("You are not logged in!");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", metadata.year);
    formData.append("department", metadata.department);
    formData.append("courseId", metadata.courseId);
    formData.append("type", metadata.type); 

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // <-- include token here
        },
      });
      alert("Upload successful!");
      setFile(null);
      setMetadata({ year: "", department: "", courseId: "" });
    } catch (error) {
      if(error.response && error.response.data.message){
        alert(error.response.data.message);
      }else{
        alert("Upload failed. Try again.");
      }
    }
    setLoading(false);
  };


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-2xl space-y-5 animate-fade-in">
      <h2 className="text-2xl font-semibold text-gray-700">Upload Question Paper</h2>

      <form onSubmit={handleUpload} className="flex flex-col gap-4">

        {/* File Input */}
        <input
          type="file"
          className="border p-2 rounded-md"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Year Input */}
        <input
          type="text"
          placeholder="Year (e.g., 2024-2025)"
          className="border p-2 rounded-md"
          value={metadata.year}
          onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
        />

        {/* ✅ Department Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={metadata.department}
          onChange={(e) => setMetadata({ ...metadata, department: e.target.value })}
        >
          <option value="">-- Select Department --</option>
          {branchOptions.map((branch) => (
            <option key={branch.value} value={branch.value}>{branch.label}</option>
          ))}
        </select>

        {/* Course Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={metadata.courseId}
          onChange={(e) => setMetadata({ ...metadata, courseId: e.target.value })}
        >
          <option value="">-- Select Course --</option>
          {availableCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        {/* ✅ Type Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={metadata.type}
          onChange={(e) => setMetadata({ ...metadata, type: e.target.value })}
        >
          <option value="">-- Select Paper Type --</option>
          {paperTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded-md transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
