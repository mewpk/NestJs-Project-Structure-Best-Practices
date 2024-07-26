###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-alpine As development

WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm @nestjs/cli && pnpm install

COPY --chown=node:node . .

RUN pnpx prisma generate


# Ensure prisma generate runs before starting the application
CMD ["sh", "-c", "pnpx prisma generate && nest start --watch"]

###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine As build

WORKDIR /app

COPY --chown=node:node package*.json pnpm-lock.yaml ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm run build

ENV NODE_ENV production

RUN pnpm install --prod && pnpm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:22-alpine As production

WORKDIR /app

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]
