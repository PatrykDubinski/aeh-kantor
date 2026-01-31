FROM node:20-alpine

# Install system dependencies for ngrok and expo
RUN apk add --no-cache libc6-compat gcompat tar unzip bash

WORKDIR /app

RUN npm install -g @expo/ngrok

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8081 19000 19001 19002

CMD ["npm", "start", "--", "--tunnel"]
