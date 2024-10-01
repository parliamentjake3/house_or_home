# House or Home

**House or Home** is a web app based on "this or that" style games, designed to help users explore and compare houses in an engaging manner. Users are presented with two house options and must choose one to move forward to the next round. The unselected house is replaced by a new option, allowing users to narrow down their preferences until a final winner is chosen.

## Features

- **House Selection Game**: Users choose between two houses until only one remains as the final winner.
- **Search and Filtering**: Narrow down house listings by country, state/territory, town, and price range.
- **Real Estate Integration**: House data (images, addresses, prices) pulled from Zillow.com or Homes.com.
- **Responsive Design**: Optimized for desktop and mobile browsing.

## Technology Stack

- **Frontend**: React.js / Vue.js / Angular (Choose one)
- **Backend**: Node.js / Express.js or Flask (Choose one)
- **Database**: MongoDB / PostgreSQL / Firebase (Choose one)
- **External APIs**: Zillow or Homes.com API (for fetching house data)
- **Deployment**: Vercel / Netlify (for frontend) and Heroku / AWS / Google Cloud (for backend)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/house-or-home.git
cd house-or-home
```

### 2. Start the web app

Use the premade shell script to install dependinces and start each server
```bash
start-project.ps1
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

1. **Search for Houses**:
   - Use the search bar to select your preferred **State/Territory**, **Town**, and **Price Range**.

2. **Select Between Two Houses**:
   - You will be shown two houses side-by-side.
   - Click on the house you prefer to advance it to the next round.
   - The other house will be replaced by a new random house from the filtered pool.

3. **Continue Until One House Remains**:
   - The game ends when there are no more new houses to show.
   - The house that was selected last will be declared the winner.

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- **User Authentication**: Allow users to save their favorite houses and view previous choices.
- **House Details Page**: Click on a house to view more in-depth details (e.g., number of bedrooms, bathrooms, etc.).
- **Analytics Dashboard**: Provide data insights on the most commonly chosen houses.
- **Wishlist Feature**: Allow users to create a wishlist of their favorite properties.

## Contact

For any questions or feedback, feel free to reach out:

- **Project Owner**: Jacob Parliament  
- **Email**: [parliamentjake3@gmail.com](mailto:parliamentjake3@gmail.com)  
- **LinkedIn**: [Jacob Parliament on LinkedIn](https://www.linkedin.com/in/jacobparliament)
