import React, { useState, useEffect } from 'react';
import axios from 'axios';
import data from './data.json';
import './App.css';

const stateAbbreviations = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  NewHampshire: 'NH',
  NewJersey: 'NJ',
  NewMexico: 'NM',
  NewYork: 'NY',
  NorthCarolina: 'NC',
  NorthDakota: 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  RhodeIsland: 'RI',
  SouthCarolina: 'SC',
  SouthDakota: 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  WestVirginia: 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

const HouseSearch = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [houses, setHouses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [currentHouses, setCurrentHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationClass, setAnimationClass] = useState(['', '']); // Animation class for each house

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

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) {
      alert('Please select both a state and a city.');
      return;
    }

    const stateAbbr = stateAbbreviations[selectedState];

    setLoading(true);
    setError('');
    setCurrentIndex(2);

    try {
      const response = await axios.get('http://localhost:5000/scrape', {
        params: { state: stateAbbr, city: selectedCity, minPrice, maxPrice },
      });
      setHouses(response.data);
      if (response.data.length > 1) {
        setCurrentHouses([response.data[0], response.data[1]]);
      }
    } catch (err) {
      setError('Failed to scrape house data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHouse = (selectedIndex) => {
    if (currentIndex < houses.length) {
      const nextHouse = houses[currentIndex];
      setCurrentIndex(currentIndex + 1);

      // Set the animation for the unselected house
      if (selectedIndex === 0) {
        setAnimationClass(['', 'fade-out-right']);
        setTimeout(() => {
          setCurrentHouses([currentHouses[0], nextHouse]);
          setAnimationClass(['', '']); // Reset animation classes
        }, 500);
      } else {
        setAnimationClass(['fade-out-left', '']);
        setTimeout(() => {
          setCurrentHouses([nextHouse, currentHouses[1]]);
          setAnimationClass(['', '']); // Reset animation classes
        }, 500);
      }
    } else {
      setCurrentHouses([currentHouses[selectedIndex]]);
    }
  };

  return (
    <div className="house-search-container">
      <h1 className='title'><span className='this_title'>THIS</span> or <span className='that_title'>THAT</span></h1>
      <div className="house-search-form">
        <label>Select State:</label>
        <select value={selectedState} onChange={handleStateChange}>
          <option value="">-- Select a State --</option>
          {Object.keys(data).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label>Select City:</label>
        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">-- Select a City --</option>
          {cityOptions.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <label>Minimum Price:</label>
        <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" />

        <label>Maximum Price:</label>
        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" />
          <br></br>
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="house-list">
        {currentHouses.length === 2 ? (
          <div className="house-compare">
            <div className={`house-card ${animationClass[0]}`}>
              <a href={currentHouses[0].url} target="_blank" rel="noopener noreferrer">
                <img src={currentHouses[0].imgUrl} alt="House 1" className="house-img" />
              </a>
              <div className="house-info">
                <h2>{currentHouses[0].address}</h2>
                <p><strong>Price:</strong> {currentHouses[0].price}</p>
                <p><strong>Bedrooms:</strong> {currentHouses[0].bedrooms}</p>
                <p><strong>Bathrooms:</strong> {currentHouses[0].bathrooms}</p>
                <p><strong>Square Feet:</strong> {currentHouses[0].sqft}</p>
              </div>
              <div className="choice-buttons">
                <button className="choice-button this" onClick={() => handleSelectHouse(0)}>This</button>
              </div>
            </div>

            <div className="or">OR</div>

            <div className={`house-card ${animationClass[1]}`}>
              <a href={currentHouses[1].url} target="_blank" rel="noopener noreferrer">
                <img src={currentHouses[1].imgUrl} alt="House 2" className="house-img" />
              </a>
              <div className="house-info">
                <h2>{currentHouses[1].address}</h2>
                <p><strong>Price:</strong> {currentHouses[1].price}</p>
                <p><strong>Bedrooms:</strong> {currentHouses[1].bedrooms}</p>
                <p><strong>Bathrooms:</strong> {currentHouses[1].bathrooms}</p>
                <p><strong>Square Feet:</strong> {currentHouses[1].sqft}</p>
              </div>
              <div className="choice-buttons">
                <button className="choice-button that" onClick={() => handleSelectHouse(1)}>That</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="winner">
            {currentHouses.length === 1 && (
              <div className="house-card">
                <h2>🏆 Winner House 🏆</h2>
                <a href={currentHouses[0].url} target="_blank" rel="noopener noreferrer">
                  <img src={currentHouses[0].imgUrl} alt="Winning House" className="house-img" />
                </a>
                <div className="house-info">
                  <h2>{currentHouses[0].address}</h2>
                  <p><strong>Price:</strong> {currentHouses[0].price}</p>
                  <p><strong>Bedrooms:</strong> {currentHouses[0].bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {currentHouses[0].bathrooms}</p>
                  <p><strong>Square Feet:</strong> {currentHouses[0].sqft}</p>
                  <a href={currentHouses[0].url} target="_blank" rel="noopener noreferrer">
                    View Listing
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HouseSearch;
