FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install fonts and curl for healthcheck
RUN apk add --no-cache fontconfig font-noto curl

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

# Start the application
CMD ["yarn", "start"]
