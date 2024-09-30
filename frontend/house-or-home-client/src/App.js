import React, { useState, useEffect } from 'react';
import axios from 'axios';
import data from './data.json'; // The list of states and cities from your uploaded file

const stateAbbreviations = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
};

const HouseSearch = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedState) {
      setCityOptions(data[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) {
      alert('Please select both a state and a city.');
      return;
    }

    setLoading(true);
    setError('');

    const stateAbbreviation = stateAbbreviations[selectedState];

    try {
      const response = await axios.get('http://localhost:5000/scrape', {
        params: { 
          state: stateAbbreviation, 
          city: selectedCity, 
          minPrice: minPrice || undefined, 
          maxPrice: maxPrice || undefined 
        },
      });
      setHouses(response.data);
    } catch (err) {
      setError('Failed to scrape house data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>House Search</h1>
      <div>
        <label>Select State:</label>
        <select value={selectedState} onChange={handleStateChange}>
          <option value="">-- Select a State --</option>
          {Object.keys(stateAbbreviations).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select City:</label>
        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">-- Select a City --</option>
          {cityOptions.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Minimum Price:</label>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
      </div>
      <div>
        <label>Maximum Price:</label>
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="house-list">
        {houses.map((house, index) => (
          <div className="house-card" key={index}>
            <img src={house.imgUrl} alt={`House ${index}`} className="house-img" />
            <div className="house-info">
              <h2>{house.address}</h2>
              <p><strong>Price:</strong> {house.price}</p>
              <p><strong>Bedrooms:</strong> {house.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {house.bathrooms}</p>
              <p><strong>Square Feet:</strong> {house.sqft}</p>
              <a href={house.url} target="_blank" rel="noopener noreferrer">View Listing</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseSearch;

