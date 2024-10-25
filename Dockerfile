###################
# BASE IMAGE
###################

FROM node:20 AS base

WORKDIR /app

###################
# DEVELOPMENT
###################

FROM base AS development

# Copy only package files for dependency caching
COPY --chown=node:node package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm @nestjs/cli && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=node:node . .

# Run Prisma and start the app in watch mode
CMD ["sh", "-c", "pnpx prisma generate --schema prisma/master.prisma && pnpx prisma generate --schema prisma/slave.prisma && pnpx ts-node-dev --watch --respawn --transpile-only -r tsconfig-paths/register src/main.ts"]

###################
# BUILD
###################

FROM base AS build

# Copy dependencies from the development stage
COPY --from=development /app/node_modules ./node_modules

# Copy application code again for building production
COPY --chown=node:node . .

RUN pnpm run build && pnpm prune --prod && pnpm cache clean --force

###################
# PRODUCTION
###################

FROM base AS production

ENV NODE_ENV=production
USER node

# Copy only necessary build files to minimize image size
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]
