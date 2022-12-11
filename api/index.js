const app = require('./app');
const http = require('http');

const config = require('./src/utils/config');
const logger = require('./src/utils/logger');

const server = http.createServer(app);
const PORT = config.PORT || 8080;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
