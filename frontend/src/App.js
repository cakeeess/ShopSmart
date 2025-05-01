import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./App.css";
import shopSmartImage from "./shopsmart.png";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePriceInput = (e, type) => {
    let value = e.target.value;
    if (value < 0) value = 0;
    if (!/^\d*$/.test(value)) return;
    type === "min" ? setMinPrice(value) : setMaxPrice(value);
  };

  const handleSearch = () => {
    if (!searchTerm || !minPrice || !maxPrice) {
      alert("Please fill in all fields before searching!");
      return;
    }
  
    setLoading(true);
  
    const searchData = {
      searchQuery: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
    };
  
    fetch("http://127.0.0.1:5000/save-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Search saved:", data);
        setLoading(false);
        navigate("/results");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        alert("Something went wrong while fetching results.");
      });
  };

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