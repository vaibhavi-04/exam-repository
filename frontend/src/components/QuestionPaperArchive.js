import React, { useState, useEffect } from "react";
import axios from "axios";

// Define soft pastel colors for courses
const pastelColors = [
  "bg-pink-200",  "bg-purple-200", "bg-green-200", "bg-gray-200"
];

// Assign colors to courses consistently
const generateCourseColor = (courseName) => {
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pastelColors[Math.abs(hash) % pastelColors.length];
};

const QuestionPaperArchive = ({ token }) => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const finalToken = token || localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questionPapers", {
          headers: { Authorization: `Bearer ${finalToken}` },
        });
        setQuestionPapers(res.data);
      } catch (err) {
        console.error("Error fetching question papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionPapers();
  }, [finalToken]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  // Group question papers by course
  const groupedByCourse = questionPapers.reduce((acc, paper) => {
    const courseName = paper.courseId.name;
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(paper);
    return acc;
  }, {});

  const handleDownload = async (paperId) => {
    if (!paperId) {
      console.error("Download failed: No paper ID provided");
      return;
    }
  
    try {
      // Fetch paper details first to construct filename
      const paperDetails = questionPapers.find((paper) => paper._id === paperId);
      if (!paperDetails) {
        console.error("Download failed: Paper details not found");
        return;
      }
  
      // Extract required info
      const { type, courseId, year } = paperDetails;
      const courseName = courseId.name.replace(/\s+/g, "_"); // Replace spaces with underscores
      const paperType = type ? type.replace(/\s+/g, "_") : "QuestionPaper"; // Handle missing type
      const fileName = `${paperType}_${courseName}_${year}`;
  
      // Request file download
      const response = await axios.get(
        `http://localhost:5000/api/questionPapers/download/${paperId}`,
        {  headers: { Authorization: `Bearer ${finalToken}` }, responseType: "blob" },
      );
  
      // Extract file extension
      const fileType = response.headers["content-type"];
      const fileExtension = fileType.split("/")[1] || "pdf"; // Default to PDF if unknown
      const fullFileName = `${fileName}.${fileExtension}`;
  
      // Create a downloadable URL
      const url = window.URL.createObjectURL(new Blob([response.data], { type: fileType }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fullFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err.response ? err.response.data : err.message);
    }
  };
  
  
  
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6 text-center">📂 Question Paper Archive</h1>

      {Object.keys(groupedByCourse).map((courseName) => {
        const coursePapers = groupedByCourse[courseName];
        const courseColor = generateCourseColor(courseName);

        return (
          <div key={courseName} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{courseName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {coursePapers.map((paper) => (
                <div
                  key={paper._id}
                  className={`p-6 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl cursor-pointer ${courseColor}`}
                  onClick={() => window.open(paper.url, "_blank")}
                  style={{ minHeight: "200px" }} // Increased card height
                >
                  <p className="text-lg font-medium text-gray-900">{paper.year}</p>
                  {paper.type && <p className="text-lg font-medium text-gray-900"> {paper.type}</p>}
                  <p className="text-gray-700">📚 Department: {paper.department}</p>
                  <p className="text-gray-600">🗂 Course: {paper.courseId.name}</p>

                   {/* 🆕 Download Button */}
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the file in a new tab
                      handleDownload(paper._id);
                    }}
                  >
                    📥 Download
                  </button>

                  
                   
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPaperArchive;

