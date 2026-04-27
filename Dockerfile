# Multi-stage Dockerfile for ShopOn

FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install

COPY server/ ./server/
RUN cd server && npx prisma generate

COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/src/index.js"]
