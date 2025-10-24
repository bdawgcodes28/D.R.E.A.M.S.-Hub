#!/bin/bash

# Auto-build server script
echo "Building Dreams Hub Server..."

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Dependencies list - add more here as needed
dependencies="express body-parser url path fs dotenv cors google-auth-library jsonwebtoken cors bcrypt"

# Install dependencies
echo "Installing server dependencies..."
npm install $DEPENDENCIES

echo "Server build complete!"