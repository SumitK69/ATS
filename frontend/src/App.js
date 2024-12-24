import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import FileUpload from "./pages/FileUpload";
import JobPostDetails from "./pages/JobPostDetails";
import PaginatedCards from "./pages/PaginatedCards";
import Navbar from "./pages/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PaginatedCards />} />
        <Route path="/job/:id" element={<JobPostDetails />} />{" "}
        {/* Job post details page */}
        {/* <Route path="/get" element={<PaginatedCards />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
