import redis from 'redis';
import bluebird from 'bluebird';
import logger from './logger';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

client.on('error', err => {
    logger.error('[Redis] Error ' + err);
});

export default client;
