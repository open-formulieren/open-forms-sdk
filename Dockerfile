ARG NGINX_VERSION=1.21

# Stage 1 -- install dev tools and build bundle
FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  ca-certificates \
  python3 \
  python-is-python3 \
  && rm -rf /var/lib/apt/lists/*

ARG SDK_VERSION=latest

# install dependencies
COPY .npmrc package-lock.json package.json ./
RUN npm ci

# copy source code & config
COPY . ./

# build SDK bundle - assets end up in /app/dist/*
RUN npm run build:design-tokens \
  && npm run build

# set up symlinks to mimick the old dist/ layout
WORKDIR /app/dist
RUN \
  ln -s "./bundles/open-forms-sdk.js" "./open-forms-sdk.js" \
  && ln -s "./bundles/open-forms-sdk.js.map" "./open-forms-sdk.js.map" \
  && ln -s "./bundles/open-forms-sdk.mjs" "./open-forms-sdk.mjs" \
  && ln -s "./bundles/open-forms-sdk.mjs.map" "./open-forms-sdk.mjs.map" \
  && ln -s "./bundles/assets" "./assets" \
  && ln -s "./bundles/open-forms-sdk.css" "./open-forms-sdk.css" \
  # and move the files to the versioned subdirectory, if a version is passed
  && if [ "$SDK_VERSION" != "latest" ]; then \
    cd .. && mv dist "$SDK_VERSION" && mkdir dist && mv "$SDK_VERSION" dist/ ; \
  fi

# Stage 2 -- serve static build with nginx
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}

WORKDIR /sdk

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ .

USER root
RUN chown 101:101 -R ./
USER nginx
