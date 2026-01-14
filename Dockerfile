FROM oven/bun AS build
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/detective"
WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

ENV NODE_ENV=production

RUN bun run build

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server
COPY ./public public

ENV NODE_ENV=production

CMD ["./server"]