# Use official Node 18 LTS
FROM mcr.microsoft.com/playwright:v1.35.0-focal

# Create app directory
WORKDIR /usr/src/app

# Copy package files first for caching node_modules
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

ENV HUNTD_BASE_URL=http://host.docker.internal:3000

# Default test command
CMD ["npx", "playwright", "test", "--reporter=html"]
