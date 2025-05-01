import React, { useEffect, useState } from "react";

const ResultsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ✅ Fetch data from the API results JSON file
    fetch("/api_results.json") // The path to api_results.json
      .then((res) => res.json())
      .then((data) => {
        setProducts(data); // Set the fetched data to the state
      })
      .catch((err) => console.error("Error loading data:", err)); // Handle any error that occurs during fetching
  }, []); // Empty dependency array, so this runs only once when the component is mounted

  const handleBack = () => {
    window.location.href = "/"; // Navigate back to the homepage when back button is clicked
  };

  return (
    <div className="results-container">
      {/* ✅ Back button */}
      <button className="back-button" onClick={handleBack}>
        ⬅ 
      </button>

      <h1 className="results-title">Top Results</h1>
      <div className="grid">
        {/* ✅ Displaying the products dynamically */}
        {products.map((item, index) => (
          <div className="product-card" key={index}>
            <h2>{item.title}</h2>
            <p className="price">{item.price}</p>
            <p className="seller">{item.seller}</p>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <button className="buy-btn">View Product</button>
              </a>
            ) : (
              <button className="buy-btn disabled">No Link</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
