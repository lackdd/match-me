#!/bin/bash

echo "SPRING_FRONTEND_URL: $SPRING_FRONTEND_URL"
echo "VITE_BACKEND_URL: $VITE_BACKEND_URL"
echo "POSTGRES_URL: $POSTGRES_URL"
echo "POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
echo "VITE_GOOGLE_API: $VITE_GOOGLE_API"
echo "VITE_GOOGLE_API_KEY: $VITE_GOOGLE_API_KEY"

# Start the backend service (in the background)
java -jar /app/matchme.jar &

# Start the frontend service (using a static server like "serve")
cd /app/frontend && npx serve -s . -l 5173