From node:19-alpine
WORKDIR /peerjs

COPY package.json .
RUN npm install
# Copy the rest of the application code to the container
COPY . .

EXPOSE 9001
CMD ["npm", "start"]