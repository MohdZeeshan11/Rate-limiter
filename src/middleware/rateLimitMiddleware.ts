import redisClient from "../config/redis/index.js";

const rateLimitMiddleware = async (req: any, res: any, next: any) => {

    // token bucket algorithm implementation
    const ip = req.ip;
    const currentTime = Date.now();
    // const windowTime = 60 * 60 * 1000; // 1 hour
    const windowTime = 1 * 60 * 1000; // 1 minute
    // const maxRequests = 100;
    const maxRequests = 10;

    const redisKey = `ratelimit:${ip}`;

    // Get current rate limit data from Redis
    const storedData = await redisClient.get(redisKey);
    let ipData = storedData ? JSON.parse(storedData) : null;


    if (!ipData) {
        ipData = { count: 1, startTime: currentTime };
    } else {
        const timeElapsed = currentTime - ipData.startTime;
        if (timeElapsed < windowTime) {
            ipData.count += 1;
            if (ipData.count > maxRequests) {
                return res.status(429).send('Too many requests. Please try again later.');
            }
        } else {
            ipData = { count: 1, startTime: currentTime };
        }
    }

    // Always save to Redis after creating/updating ipData
    await redisClient.setEx(redisKey, Math.ceil(windowTime / 1000), JSON.stringify(ipData));
    next();
}


export { rateLimitMiddleware };