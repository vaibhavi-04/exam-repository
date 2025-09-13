import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthModal from "./components/authModal";
import Profile from "./components/profile";
import UploadForm from "./components/UploadForm";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import Notifications from "./components/Notifications";
import QuestionPaperArchive from "./components/QuestionPaperArchive";
import FilterSearch from "./components/FilterSearch";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <AuthProvider>
      <Router>
        {/* Navbar with login/signup buttons */}
        <Navbar setShowLogin={setShowLogin} setShowSignup={setShowSignup} />

        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
          {/* <h1 className="text-2xl font-bold text-gray-700 mb-4">Question Paper Archive</h1> */}

          {/* Define Routes */}
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/searchQuestion" element={<SearchBar />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/questionPaperArchive" element={<QuestionPaperArchive />} />
            <Route path="/" element={
              <>
                <UploadForm />
                <div className="my-6"></div> {/* Spacing */}
                <SearchBar />
              </>
            } />
            <Route path="/filter" element={<FilterSearch />} />
          </Routes>
        </div>

        {/* Login & Signup Pop-up Modals */}
        <AuthModal 
          showLogin={showLogin} 
          showSignup={showSignup} 
          setShowLogin={setShowLogin} 
          setShowSignup={setShowSignup} 
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
