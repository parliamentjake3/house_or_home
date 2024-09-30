import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState("");
  const [houses, setHouses] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scrape`, {
        params: {
          location: location
        }
      });
      setHouses(response.data);
    } catch (error) {
      console.error("Failed to fetch houses", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>House or Home</h1>
      <input
        type="text"
        placeholder="Enter a location (e.g., New-York-NY)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '10px' }}>
        Search Houses
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>Search Results</h2>
        <ul>
          {houses.map((house, index) => (
            <li key={index}>
              <a href={house.link} target="_blank" rel="noopener noreferrer">
                {house.address} - {house.price}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
