FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --production

COPY . .

# السطر ده مش موجود
# RUN npm run build:js

EXPOSE 4200

CMD ["npm", "start"]