FROM node:13
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY .babelrc ./
COPY babel.config.js ./
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/bin/www.js" ]
