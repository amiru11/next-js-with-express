FROM node:14-alpine AS base
LABEL version="1.0"
LABEL author="saem<wrfg12@gmail.com>"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS build
WORKDIR /build
COPY --from=base /app ./
RUN npm run build
RUN npm run build:server

FROM amazonlinux:2
WORKDIR /app
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash
RUN yum install -y nodejs
# 필수 파일/폴더 추가
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/next.config.js ./next.config.js
COPY --from=build /build/tsconfig.json ./tsconfig.json
COPY --from=build /build/tsconfig.server.json ./tsconfig.server.json
COPY --from=build /build/dist ./dist
RUN npm install next

EXPOSE 3000
CMD [ "npm", "run", "start" ]
