import 'babel-polyfill';
import express from 'express';
import config from './config';
import logger from './logger';
import account from './routes/account';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use('/accounts', account);

app.listen(config.EXPRESS_PORT, () => {
    logger.info("Express starts at " + config.EXPRESS_PORT);
});

export default app;
