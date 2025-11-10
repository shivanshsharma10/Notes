# 1. Start with a lightweight official Node.js image
FROM node:18-alpine

# 2. Create and set the main working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
# We copy these first to take advantage of Docker's caching.
COPY package*.json ./

# 4. Install all dependencies
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Tell Docker your app runs on port 5000
EXPOSE 5000

# 7. The command to run your application
CMD [ "node", "server.js" ]