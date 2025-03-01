## Use Node.js image to build the React app
#FROM node:20 AS build
#
## Set working directory inside container
#WORKDIR /app
#
## Copy package.json and install dependencies
#COPY package.json package-lock.json ./
#RUN npm install
#
## Copy all source files and build the project
#COPY . .
#RUN npm run build
#
## Use Nginx to serve the built React app
#FROM nginx:alpine
#
## Copy the built React files from the build stage to Nginx's default directory
#COPY --from=build /app/build /usr/share/nginx/html
#
## Copy custom Nginx config for SPA (Single Page Application) handling
#COPY nginx.conf /etc/nginx/nginx.conf
#
## Expose port 80 (Nginx default port)
#EXPOSE 80
#
## Start Nginx in the foreground
#CMD ["nginx", "-g", "daemon off;"]


#FROM node:20-alpine AS build
#
#WORKDIR /app
#
#COPY package.json package-lock.json ./
#RUN npm install
#
#COPY . .
#RUN npm run build
#
#RUN rm -rf /app/.git /app/node_modules /app/package-lock.json
#
#RUN ls -la /app
#
## Use serve to serve the React app
#FROM node:20-alpine
#
#WORKDIR /app
#
## Install serve to serve the React build
#RUN npm install -g serve
#
## Copy the built app from the build stage
#COPY --from=build /app/dist /app/build
#
#EXPOSE 5173
#
#CMD ["serve", "-s", "build", "-l", "5173"]


#FROM node:20-alpine
#WORKDIR /app
#ENV PATH=/app/node_modules/.bin:$PATH
#COPY package.json .
#COPY package-lock.json .
#RUN npm ci # -g npm@8.9.0
#COPY . .
#EXPOSE 5173
#CMD ["npm", "run", "dev"]


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
