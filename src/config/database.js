const config = {
    MYSQL_HOST: process.env.MYSQL_HOST || '127.0.0.1',
    MYSQL_USERNAME: process.env.MYSQL_USERNAME || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'casino',
};

export default config;
