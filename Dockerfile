# Use official Playwright image with browsers
FROM mcr.microsoft.com/playwright:focal

WORKDIR /usr/src/app

# Install OpenJDK and utilities needed for Allure
RUN apt-get update && apt-get install -y openjdk-11-jre-headless wget unzip

# Install global Allure CLI
RUN npm install -g allure-commandline --unsafe-perm=true

# Copy package.json and lockfile
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npm ci

# Copy project files
COPY . .

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Default command: run tests with Allure reporter and generate report
CMD bash -c "\
  if [ -z \"$HUNTD_BASE_URL\" ]; then echo 'HUNTD_BASE_URL not set. Exiting.'; exit 1; fi; \
  npx playwright test --reporter=allure-playwright && \
  allure generate allure-results -o allure-report --clean \
"
