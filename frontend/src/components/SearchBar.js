import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react"; // Adding search icon

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      console.log("Searching in frontend...");
      const { data } = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">🔍 Search Question Papers</h2>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter keyword (e.g., array, DBMS, 2022)"
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="flex items-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition duration-300"
        >
          <Search size={18} className="mr-2" /> Search
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500 mt-3">🔄 Searching...</p>}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((paper, index) => (
              <a
                key={index}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg shadow-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-transform transform hover:scale-105 cursor-pointer"
              >
                <p className="text-gray-800 font-medium">{paper.subject} - {paper.year}</p>
                <p className="text-gray-600 text-sm">{paper.department}, Sem {paper.semester}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
