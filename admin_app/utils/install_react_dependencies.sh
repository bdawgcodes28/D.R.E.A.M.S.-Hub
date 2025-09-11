#!/bin/bash
set -e

echo "Installing..."
admin_app="../admin"
cd ${admin_app}
npm install react-google-button react-icons react-router-dom

echo "Installed successfully"
