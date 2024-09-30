const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cors = require('cors');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Function to introduce a manual delay
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Function to scroll the target container using the mouse wheel for a set number of times
async function fixedScrollUsingMouseWheel(page, scrollableSelector, scrollCount = 30, step = 300) {
  try {
    const scrollContainer = await page.$(scrollableSelector);

    if (!scrollContainer) {
      console.log(`Scrollable container not found: ${scrollableSelector}`);
      return;
    }

    await scrollContainer.hover();

    for (let i = 1; i <= scrollCount; i++) {
      await page.mouse.wheel({ deltaY: step });
      await delay(500);
    }
  } catch (error) {
    console.log("Error during fixed scroll wheel simulation:", error);
  }
}

// Function to scrape house data from Homes.com based on state, city, and price range
async function scrapeHomes(state, city, minPrice, maxPrice) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  const formattedCity = city.toLowerCase().replace(/ /g, '-');

  // Build the URL based on state, city, and optional price parameters
  let url = `https://www.homes.com/${formattedCity}-${state}/houses-for-sale/`;
  if (minPrice || maxPrice) {
    url += '?';
    if (minPrice) {
      url += `price-min=${minPrice}&`;
    }
    if (maxPrice) {
      url += `price-max=${maxPrice}&`;
    }
    url = url.slice(0, -1); // Remove trailing '&' or '?' if present
  }
  console.log(`Navigating to: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Page loaded successfully.");

    const scrollableSelector = '#placardContainer';
    console.log("Scrolling using the mouse scroll wheel to load all house elements...");
    await fixedScrollUsingMouseWheel(page, scrollableSelector, 10, 900);

    await delay(5000);
    await page.screenshot({ path: 'homes_debug_after_scroll.png' });
    console.log(`Page screenshot taken after scroll: homes_debug_after_scroll.png`);

    const houseElements = await page.$$('li.placard-container');
    console.log(`Found ${houseElements.length} house elements using class selector.`);

    const houses = await page.evaluate(() => {
      const houseElements = document.querySelectorAll('li.placard-container');
      let houseData = [];

      houseElements.forEach((house) => {
        try {
          let address = house.querySelector('.property-name') ? house.querySelector('.property-name').innerText : 'N/A';
          let price = house.querySelector('.price-container') ? house.querySelector('.price-container').innerText.trim() : 'N/A';
          let detailedInfo = house.querySelectorAll('.detailed-info-container li');

          let bedrooms = detailedInfo[0] ? detailedInfo[0].innerText : 'N/A';
          let bathrooms = detailedInfo[1] ? detailedInfo[1].innerText : 'N/A';
          let sqft = detailedInfo[2] ? detailedInfo[2].innerText : 'N/A';
          let url = house.querySelector('a') ? house.querySelector('a').href : '#';

          let imgElements = house.querySelectorAll('.embla__slide__img');
          let imgUrl = 'N/A';
          for (let img of imgElements) {
            if (img.src && (img.src.includes('.jpg') || img.src.includes('.png'))) {
              imgUrl = img.src;
              break;
            }
          }

          houseData.push({
            address: address,
            price: price,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            sqft: sqft,
            url: url,
            imgUrl: imgUrl,
          });
        } catch (err) {
          console.log("Error extracting data for a house:", err);
        }
      });

      return houseData;
    });

    await browser.close();
    console.log(`Scraping completed successfully. Found ${houses.length} houses.`);
    return houses;
  } catch (error) {
    console.error(`Error scraping data: ${error.message}`);
    await page.screenshot({ path: 'error_homes.png' });
    console.log(`Error screenshot taken: error_homes.png`);
    await browser.close();
    return [];
  }
}

// API endpoint to handle the simplified scraping of a fixed page with price filters
app.get('/scrape', async (req, res) => {
  const state = req.query.state;
  const city = req.query.city;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  if (!state || !city) {
    return res.status(400).send({ error: 'Please provide both state and city parameters.' });
  }

  try {
    console.log(`Received request to scrape Homes.com for ${city}, ${state}, minPrice: ${minPrice}, maxPrice: ${maxPrice}`);
    const data = await scrapeHomes(state, city, minPrice, maxPrice);
    console.log("Data successfully scraped. Sending response.");
    res.json(data);
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).send({ error: 'Failed to scrape house data.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
