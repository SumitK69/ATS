import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Page.css";

const PaginatedCards = () => {
  const [cards, setCards] = useState([]); // State to store card data
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isNextDisabled, setIsNextDisabled] = useState(false); // Disable 'Next' button
  const API_URL = "http://localhost:5000/jobs"; // Replace with your API URL

  // Fetch data when the page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}?page=${currentPage}`);
        const result = await response.json();
        setCards(result.data); // Set card data
        console.log(result.data);
        setIsNextDisabled(result.data.length < 20); // Disable 'Next' if fewer than 20 cards
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  // Event handlers for pagination
  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="paginated-cards">
      {/* Cards Container */}
      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <Link to={`/job/${card.id}`} className="card-link">
              <h1 className="card-title">
                {card.company_name || "Unnamed Item"}
              </h1>
              <h3 className="card-position">
                {card.position_title || "Unnamed Item"}
              </h3>
              <p className="card-description limited-text">
                {card.job_description || "No description available"}
              </p>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="pagination-info">Page {currentPage}</span>
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedCards;
