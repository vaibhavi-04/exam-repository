import { useState, useEffect } from "react";
import axios from "axios";

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    courseId: "",
    year: "",
    type: "",
  });
  const [results, setResults] = useState([]);

  // ✅ Fetch Courses for Dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/all");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Handle Search
  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:5000/api/filter/search?${queryParams}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-5">
      <h2 className="text-2xl font-bold text-gray-700">Search Question Papers</h2>

      {/* ✅ Filters */}
      <div className="grid grid-cols-3 gap-4">
        {/* Course Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={filters.courseId}
          onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">-- Select Year --</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>

        {/* Type Dropdown */}
        <select
          className="border p-2 rounded-md"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">-- Select Type --</option>
          <option value="midsem">Midsem</option>
          <option value="endsem">Endsem</option>
          <option value="quiz-1">Quiz-1</option>
          <option value="quiz-2">Quiz-2</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* ✅ Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Search
      </button>

      {/* ✅ Display Results */}
      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-gray-700">Results:</h3>
          <ul className="list-disc ml-6">
            {results.map((paper) => (
              <li key={paper._id} className="text-gray-600">
                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {paper.courseId.name} - {paper.year} ({paper.type})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
