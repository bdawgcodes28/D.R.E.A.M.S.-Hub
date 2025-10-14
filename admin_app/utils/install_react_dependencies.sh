#!/bin/bash
set -e

echo "Installing..."
admin_app="./admin"
cd ${admin_app}
npm install react-loading-skeleton react-google-button jwt-decode google-one-tap react-icons react-router-dom @supabase/supabase-js motion usehooks-ts jwt-decode bcrypt


echo "Installed successfully"
