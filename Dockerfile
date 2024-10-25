###################
# BASE IMAGE
###################

FROM node:22-alpine AS base

WORKDIR /app

###################
# DEVELOPMENT
###################

FROM base AS development

COPY --chown=node:node package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm @nestjs/cli && pnpm install

COPY --chown=node:node . .

# Ensure Prisma generate runs before starting the application
CMD ["sh", "-c", "pnpx prisma generate && pnpx prisma db push && nest start --watch"]

###################
# BUILD
###################

FROM base AS build

COPY --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN pnpm run build && pnpm prune --prod && pnpm cache clean --force

###################
# PRODUCTION
###################

FROM base AS production

ENV NODE_ENV=production
USER node

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]
