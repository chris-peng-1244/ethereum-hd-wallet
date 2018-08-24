import express from 'express';
import config from './config';
import logger from './logger';
import account from './routes/account';

const app = express();

app.use('account', account);

app.listen(config.EXPRESS_PORT, () => {
    logger.info("Express starts at " + config.EXPRESS_PORT);
});