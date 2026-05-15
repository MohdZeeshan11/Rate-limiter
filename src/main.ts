import express from 'express';
import dotenv from 'dotenv';
import { userLogin } from './controllers/user.js';
import { rateLimitMiddleware } from './middleware/rateLimitMiddleware.js';
// import connectRedis from './config/redis/index.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import routes from './routes';

// // Middleware
// app.use(express.json());


// // Routes
// app.use('/api', routes);
app.get('/login', rateLimitMiddleware, userLogin);
app.get('/', (req, res) => {
    res.send('Hello, Express server is running!');
});

// connectRedis();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});




/*

Rate Limiter Implementation:
Rate limiting is a technique used to control the amount of incoming traffic to a server. It helps prevent abuse and ensures fair usage of resources. Below is a simple implementation of a rate limiter middleware in Express.js.

Algorithm:
1. Token Bucket Algorithm: This algorithm uses a bucket to hold tokens. Each request consumes a token, and tokens are replenished at a fixed rate. If the bucket is empty, the request is denied.
2. Leaky Bucket Algorithm: Similar to the token bucket, but instead of replenishing tokens, it processes requests at a fixed rate. If the bucket is full, incoming requests are dropped.
3. Fixed Window Counter: This algorithm counts the number of requests in a fixed time window (e.g., 1 hour). If the count exceeds the limit, further requests are denied until the window resets.
4. Sliding Window Log: This algorithm keeps a log of timestamps for each request. It allows a certain number of requests within a sliding time window, providing more flexibility than the fixed window counter.
5. Sliding Window Fixed Counter: This algorithm maintains a count of requests in a sliding time window. It allows a certain number of requests within the window, and the count is updated as time progresses.

1. Create a middleware function to track the number of requests from each IP address.
2. Use a simple in-memory store (like a JavaScript object) to keep track of request counts and timestamps for each IP address.
3. Set a limit for the number of requests allowed within a specific time window (e.g., 100 requests per hour).
4. When a request is made, check the store for the IP address:
   - If the IP address is not in the store, add it with a count of 1 and the current timestamp.
   - If the IP address is in the store, check the timestamp:
        - If the current time is within the time window, increment the count. If the count exceeds the limit, deny the request.
        - If the current time is outside the time window, reset the count to 1 and update the timestamp.

Note: For a production environment, consider using a more robust solution like Redis to store request counts and timestamps, as it can handle concurrent requests and provides persistence.
    */