import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./App.css";
import shopSmartImage from "./shopsmart.png";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./App.css";
import shopSmartImage from "./shopsmart.png";

const App = () => {
  // Set sample values explicitly for testing
  const [searchTerm, setSearchTerm] = useState("one plus 6T");
  const [minPrice, setMinPrice] = useState("30000");
  const [maxPrice, setMaxPrice] = useState("40000");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


// Load saved values (but don't auto-search) when component mounts
useEffect(() => {
  const savedSearchTerm = localStorage.getItem("searchTerm");
  const savedMinPrice = localStorage.getItem("minPrice");
  const savedMaxPrice = localStorage.getItem("maxPrice");

  if (savedSearchTerm) setSearchTerm(savedSearchTerm);
  if (savedMinPrice) setMinPrice(savedMinPrice);
  if (savedMaxPrice) setMaxPrice(savedMaxPrice);
}, []);


const handlePriceInput = (e, type) => {
  let value = e.target.value;
  if (value < 0) value = 0;
  if (!/^\d*$/.test(value)) return;

  if (type === "min") {
    setMinPrice(value);
    localStorage.setItem("minPrice", value);
  } else {
    setMaxPrice(value);
    localStorage.setItem("maxPrice", value);
  }
};

  const handleSearch = async () => {
    if (!searchTerm || !minPrice || !maxPrice) {
      alert("Please fill in all fields before searching!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/save-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: searchTerm,
          minPrice,
          maxPrice,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Data saved to Flask:", data);
        navigate("/results");
      } else {
        alert("Error from backend: " + data.error);
      }
    } catch (error) {
      alert("Connection error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Automatically trigger search on component mount for testing
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="container">
      {loading && (
        <div className="loader-screen">
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <img src={shopSmartImage} alt="ShopSmart" className="title-image" />

          <div className="search-box">
            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="price-range">
            <label>Price range:</label>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => handlePriceInput(e, "min")}
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => handlePriceInput(e, "max")}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </>
      )}
    </div>
  );
};

export default App;
