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

    // Store user input if needed later (optional)
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("minPrice", minPrice);
    localStorage.setItem("maxPrice", maxPrice);

    setTimeout(() => {
      setLoading(false);
      navigate("/results");
    }, 2000);
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
