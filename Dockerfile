FROM node:19-alpine

WORKDIR /lazygram_react

COPY . /lazygram_react/

RUN npm run-script build

COPY . .