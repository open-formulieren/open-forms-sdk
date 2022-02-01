ARG NGINX_VERSION=1.21

# Stage 1 -- install dev tools and build bundle
FROM node:14-buster-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ARG SDK_VERSION=latest

# install dependencies
COPY yarn.lock package.json ./
RUN yarn install

# copy source code & config
COPY . ./

# build SDK bundle
RUN yarn run build

# Stage 2 -- serve static build with nginx
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}

WORKDIR /sdk

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ .

USER root
RUN chown 101:101 -R ./
USER nginx
