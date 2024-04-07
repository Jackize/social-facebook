FROM node:18-alpine
WORKDIR /api
COPY package.json .
ARG NODE_ENV
RUN if ["$NODE_ENV" = "production"]; \
        then npm ci --only=production; \
        else npm install; \
        fi

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
