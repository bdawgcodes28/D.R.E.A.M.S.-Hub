# RUNNING ON NODE CONTAINER RUNNING LINUX
FROM node:alpine

# CD INTO CONTAINER
WORKDIR /app

# COPY PACKAGE FILES FOR DEPENDENCY INSTALLATION
COPY client/package*.json ./client/
COPY server_side/package*.json ./server_side/

# INSTALL CLIENT DEPENDENCIES
WORKDIR /app/client
RUN npm install

# INSTALL SERVER DEPENDENCIES
WORKDIR /app/server_side
RUN npm install

# COPY CLIENT SOURCE FILES AND BUILD
WORKDIR /app
COPY client ./client
WORKDIR /app/client
# Build with empty VITE_BASE_URL to use relative URLs in production (same origin)
RUN NODE_ENV="production" VITE_BASE_URL="" VITE_REST_API_PORT="" npm run build

# COPY SERVER SOURCE FILES
WORKDIR /app
COPY server_side ./server_side

# SET WORKING DIRECTORY TO SERVER SIDE FOR RUNNING
WORKDIR /app/server_side

# RUN COMMANDS TO START THE CONTAINER
EXPOSE 3000
CMD [ "node", "server.js" ]
