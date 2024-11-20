###################
# BASE IMAGE
###################

# Use the slim version of Node for a smaller image size
FROM node:20-slim AS base

# Set working directory
WORKDIR /app

# Install pnpm globally in the base image
RUN npm install -g pnpm

# Set PNPM_HOME to the global bin directory and add it to PATH
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:/usr/local/bin:${PATH}"

# Install OpenSSL to ensure compatibility with Prisma
RUN apt-get update -y && apt-get install -y openssl

# Create the 'uploads' directory and set permissions for the 'node' user
RUN mkdir -p /app/uploads && chown -R node:node /app

# Copy the .env file to the container
COPY .env .env

###################
# DEVELOPMENT
###################

FROM base AS development

# Install only necessary dependencies for development
RUN pnpm add -g @nestjs/cli

# Copy only the necessary package files for dependency installation
COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=node:node . .

# Expose port 3333 for development
EXPOSE 3333

# Run Prisma and start the app in watch mode for development
CMD ["sh", "-c", "pnpx prisma generate && pnpx ts-node-dev --watch --respawn --transpile-only --poll -r tsconfig-paths/register src/main.ts"]

###################
# BUILD
###################

FROM base AS build

# Copy only package files and install dependencies to leverage caching
COPY --chown=node:node package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy application code for building production assets
COPY --chown=node:node . .

# Generate Prisma files and build the app, then prune dev dependencies
RUN pnpx prisma generate --schema=prisma/master.prisma
RUn pnpx prisma generate --schema=prisma/slave.prisma
RUN pnpm run build
RUN pnpm prune --prod
RUN pnpm cache clean

###################
# PRODUCTION
###################

# Use a smaller Node.js runtime for production
FROM node:20-slim AS production

# Install OpenSSL in the production stage as well
RUN apt-get update -y && apt-get install -y openssl

# Set environment variables
ENV NODE_ENV=production
WORKDIR /app

# Copy application files, including .env, to the container
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=base /app/uploads /app/uploads
COPY --from=base /app/.env /app/.env

# Expose port 3333 for production
EXPOSE 3333

# Switch to the non-root user 'node'
USER node

# Start the application
CMD ["node", "dist/main.js"]