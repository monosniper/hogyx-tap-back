FROM node

WORKDIR /var/www/api

COPY app/package.json app/package-lock.json ./
RUN npm install
COPY app .

ENTRYPOINT [ "node", "index.js" ]