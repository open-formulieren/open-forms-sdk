ARG NGINX_VERSION=1.21

# Stage 1 -- install dev tools and build bundle
FROM node:14-buster-slim AS build

WORKDIR /app

ARG SDK_VERSION=latest

# install dependencies
COPY yarn.lock package.json ./
RUN yarn install

# copy source code & config
COPY . ./

# build SDK bundle
RUN yarn run build

# Stage 2 -- serve static build with nginx
FROM nginx:${NGINX_VERSION}

WORKDIR /sdk

RUN useradd -M -u 1000 maykin
RUN chown -R maykin /app

# drop privileges
USER maykin

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ .
