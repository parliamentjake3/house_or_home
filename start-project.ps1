# Navigate to backend folder and install dependencies
cd backend
Write-Output "Installing backend dependencies..."
npm install

# Start the backend server
Write-Output "Starting the backend server..."
Start-Process "cmd.exe" "/c node server.js" -NoNewWindow

# Navigate to frontend React app folder
cd ../frontend/house-or-home-client
Write-Output "Installing frontend dependencies..."
npm install

# Start the frontend server
Write-Output "Starting the frontend server..."
Start-Process "cmd.exe" "/c npm start" -NoNewWindow
