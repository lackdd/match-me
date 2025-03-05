#!/bin/bash

# Start the backend service (in the background)
java -jar /app/matchme.jar &

# Start the frontend service (using a static server like "serve")
cd /app/frontend && npx serve -s . -l 5173