import express from 'express';
import config from './config';
import logger from './logger';

const app = express();

app.listen(config.EXPRESS_PORT, () => {
    logger.info("Express starts at " + config.EXPRESS_PORT);
});