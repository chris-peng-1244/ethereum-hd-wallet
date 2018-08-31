import config from './config';
import {createLogger, transports, format } from 'winston';

const logger = createLogger({
    format: format.json(),
    transports: [
        new transports.File({
            filename: 'logs/app.log',
            level: config.LOG_LEVEL,
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
});

export default logger;
