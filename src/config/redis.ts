import { createClient } from 'redis'


const redisClient = createClient();

(async() => {
    await redisClient.connect();
})();

export default redisClient;