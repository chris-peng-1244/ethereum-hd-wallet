import config from './index';

const development = {
    username: config.MYSQL_USERNAME,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    host: config.MYSQL_HOST,
    dialect: 'mysql',
};

export {
    development,
}
