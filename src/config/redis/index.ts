// how to connect to redis server and export the client for use in other files
import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis server');
    } catch (err) {
        console.error('Failed to connect to Redis server', err);
    }
}

connectRedis();

export default redisClient;
// export default connectRedis