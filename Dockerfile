FROM oven/bun AS build
LABEL org.opencontainers.image.source="https://github.com/thatgurkangurk/detective"
WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
COPY bunfig.toml bunfig.toml

RUN bun install

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

ENV NODE_ENV=production

RUN bun run build

FROM frolvlad/alpine-glibc

WORKDIR /app

RUN apk --no-cache add libstdc++ libgcc

COPY --from=build /app/server server

RUN chmod +x ./server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./server"]