#!/bin/bash

# This script updates the Render build command using the API
# You need a Render API key to run this

# Get your API key from: https://dashboard.render.com/account/api-tokens

API_KEY="YOUR_RENDER_API_KEY"  # Replace with your actual API key
SERVICE_ID="srv-d4qq9d7dees739bae0"  # This is your stechx-api service ID

echo "Updating Render build command..."

curl -X PATCH \
  https://api.render.com/v1/services/$SERVICE_ID \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "buildCommand": "cd api && npm run build"
  }'

echo ""
echo "✅ Build command updated!"
echo "Render will automatically redeploy with the new command."
echo "Check your deployment at: https://dashboard.render.com"
