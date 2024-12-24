import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook to get dynamic URL params
import "../Styles/Page.css";
import "../Styles/JobPostPage.css";

const JobPostDetails = () => {
  const { id } = useParams(); // Get the job post ID from the URL
  console.log("id", id);
  const [jobPost, setJobPost] = useState(null); // State to store job post details
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle apply form visibility
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    resume: null,
  });
  const [fileName, setFileName] = useState(""); // State to store the file name
  const [modelResponse, setModelResponse] = useState(null); // State for parsed model response

  // Fetch job post details when the component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-cards/${id}`);
        const result = await response.json();
        setJobPost(result); // Set the job post data

        // Parse model_response if available
        if (result.model_response) {
          const jsonObject = JSON.parse(result.model_response);
          setModelResponse(jsonObject); // Set the parsed model response
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
  }, [id]); // Re-run if the ID changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, resume: file });
    setFileName(file.name); // Set the file name after selecting the file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFormData({ ...formData, resume: file });
    setFileName(file.name); // Set the file name after dropping the file
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.resume
    ) {
      alert("Please fill all fields and upload your resume.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("resume", formData.resume);
    formDataToSend.append("jobPostId", id); // Append the job post id

    try {
      const response = await fetch("http://localhost:5000/submit-application", {
        method: "POST",
        body: formDataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        alert("Application submitted successfully!");
        // Reset form after submission
        setFormData({
          name: "",
          email: "",
          contact: "",
          resume: null,
        });
        setFileName(""); // Reset file name
      } else {
        alert(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred while submitting the application.");
    }
  };

  const toggleApplyForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (!jobPost || !modelResponse) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="job-post-details">
      <h1>{jobPost.company_name}</h1>
      <h3>{jobPost.position_title}</h3>
      <p>{jobPost.job_description}</p>

      {/* Render job requirements dynamically */}
      <span>
        {Object.entries(modelResponse).map(([key, value]) => (
          <p key={key}>
            <strong>{key.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>{" "}
            {value}
          </p>
        ))}
      </span>

      {/* Apply Button */}
      <button className="apply-button" onClick={toggleApplyForm}>
        Apply Now
      </button>

      {/* Apply Form */}
      {isFormVisible && (
        <div className="apply-form">
          <h2>Apply for this Job</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number:</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume">Upload Resume:</label>
              <div
                className="file-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf, .doc, .docx"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="choose-file-button"
                  onClick={() => document.getElementById("resume").click()}
                >
                  Choose File
                </button>
                <p>Or drag and drop your resume here</p>
                {fileName && (
                  <p>
                    <strong>Selected File:</strong> {fileName}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="submit-button">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobPostDetails;
