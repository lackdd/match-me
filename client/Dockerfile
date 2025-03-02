# === STAGE 1: Build the React app ===
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first (this allows caching)
COPY package.json ./
COPY package-lock.json ./

RUN ls -al /app

RUN pwd

# Install dependencies
RUN npm ci  # `ci` is faster and ensures consistency

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# === STAGE 2: Serve with a lightweight image ===
FROM node:20-alpine

WORKDIR /app

# Install `serve` to serve the built React app
RUN npm install -g serve

# Copy the package.json and package-lock.json from the build stage
COPY --from=build /app/package.json /app/package-lock.json /app/

# Copy only the built application from the previous stage
COPY --from=build /app/dist /app/dist

# Verify that package.json is in place
RUN ls -al /app

# Expose the port Vite uses
EXPOSE 5173

# Start the application
# For production (with `serve`)
CMD ["serve", "-s", "dist", "-l", "5173"]

# For development (with `npm run dev`) but gives error that it can't find app/package.lock
#RUN npm install #
#CMD ["npm", "run", "dev"]
