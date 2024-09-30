const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Function to scrape house data based on the given location
async function scrapeHouses(location) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Construct the URL dynamically based on the user input
  const zillowURL = `https://www.zillow.com/${location}/`;

  try {
    // Navigate to the URL
    await page.goto(zillowURL, { waitUntil: 'networkidle2' });

    // Wait for the list of houses to load
    await page.waitForSelector('li.ListItem-c11n-8-105-0__sc-13rwu5a-0');

    // Extract data from each house listing
    const houses = await page.evaluate(() => {
      const houseElements = document.querySelectorAll('li.ListItem-c11n-8-105-0__sc-13rwu5a-0');
      let houseData = [];

      houseElements.forEach((house) => {
        // Extract the structured JSON data from the <script> tag
        const scriptTag = house.querySelector('script[type="application/ld+json"]');
        if (scriptTag) {
          const jsonData = JSON.parse(scriptTag.innerText);

          // Extract details like name, address, price, etc.
          let address = jsonData.address ? jsonData.address.streetAddress + ", " + jsonData.address.addressLocality + ", " + jsonData.address.addressRegion + " " + jsonData.address.postalCode : 'N/A';
          let price = house.querySelector('[data-test="property-card-price"]') ? house.querySelector('[data-test="property-card-price"]').innerText : 'N/A';
          let bedrooms = house.querySelector('li:nth-child(1) b') ? house.querySelector('li:nth-child(1) b').innerText : 'N/A';
          let bathrooms = house.querySelector('li:nth-child(2) b') ? house.querySelector('li:nth-child(2) b').innerText : 'N/A';
          let sqft = house.querySelector('li:nth-child(3) b') ? house.querySelector('li:nth-child(3) b').innerText : 'N/A';
          let url = jsonData.url ? jsonData.url : '#';

          houseData.push({
            address: address,
            price: price,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            sqft: sqft,
            url: url
          });
        }
      });

      return houseData;
    });

    await browser.close();
    return houses;
  } catch (error) {
    console.error(`Error scraping data: ${error}`);
    await browser.close();
    return [];
  }
}

// API endpoint to handle web scraping based on user input
app.get('/scrape', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).send({ error: 'Please provide a location (e.g., New-York-NY).' });
  }

  try {
    const data = await scrapeHouses(location);
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: 'Failed to scrape house data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
