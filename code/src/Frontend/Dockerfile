# Use Node.js 18 as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install


# Copy the rest of the application
COPY . .

# Expose the frontend port - build
RUN npm run dev
EXPOSE 5173

CMD ["npm", "run", "preview"]
