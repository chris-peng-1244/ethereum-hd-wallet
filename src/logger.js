import {createLogger, transports, format } from 'winston';

const logger = createLogger({
    format: format.json(),
    transports: [
        new transports.File({
            filename: 'logs/app.log',
            level: 'info'
        }),
        new transports.Console()
    ]
});

export default logger;