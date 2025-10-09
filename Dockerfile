ARG NGINX_VERSION=1.21

# Stage 1 -- install dev tools and build bundle
FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ARG SDK_VERSION=latest

# install dependencies
COPY .npmrc package-lock.json package.json ./
RUN npm ci

# copy source code & config
COPY . ./

# build SDK bundle
RUN npm run build:design-tokens \
  && npm run build

# set up symlinks to mimick the old dist/ layout
RUN \
  BASE=/app/dist \
  && if [ "$SDK_VERSION" != "latest" ]; then \
    BASE="$BASE/$SDK_VERSION"; \
  fi \
  && ln -s "$BASE/bundles/open-forms-sdk.js" "$BASE/open-forms-sdk.js" \
  && ln -s "$BASE/bundles/open-forms-sdk.mjs" "$BASE/open-forms-sdk.mjs" \
  && ln -s "$BASE/bundles/assets" "$BASE/assets" \
  && ln -s "$BASE/bundles/static" "$BASE/static" \
  && ln -s "$BASE/bundles/open-forms-sdk.css" "$BASE/open-forms-sdk.css"

# Stage 2 -- serve static build with nginx
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}

WORKDIR /sdk

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ .

USER root
RUN chown 101:101 -R ./
USER nginx
