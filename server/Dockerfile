# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# ---- Dependencies ----
# First, copy only package.json and package-lock.json to leverage Docker cache
FROM base AS dependencies
COPY package.json package-lock.json* ./
# Using npm ci for cleaner installs, especially in CI/CD
RUN npm ci --omit=dev
# If you had a build step (e.g., for TypeScript), you'd run it here
# RUN npm run build

# ---- Release ----
# Now, copy the clean node_modules and the rest of your app code
FROM base AS release
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

# Expose the port the app runs on (should match your PORT env var)
# Assuming your app listens on 3000 or what's in process.env.PORT
EXPOSE ${PORT:-3000}

# Command to run the application
# This uses the "start" script from your package.json
CMD ["npm", "start"]
