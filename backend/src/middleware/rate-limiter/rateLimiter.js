import redisClient from "../../config/redis.js";

/**
 * @desc Rate limiting middleware using Redis
 * @param {number} limit - Max number of requests
 * @param {number} windowSeconds
 */
const rateLimiter = (limit = 100, windowSeconds = 60) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;

      // Increment request count
      const currentCount = await redisClient.incr(key);

      if (currentCount === 1) {
        // If first request, set TTL
        await redisClient.expire(key, windowSeconds);
      }

      if (currentCount > limit) {
        const ttl = await redisClient.ttl(key);
        return res.status(429).json({
          success: false,
          message: `Too many requests. Try again in ${ttl}s.`,
        });
      }

      // Proceed to next middleware
      next();
    } catch (error) {
      console.error("Rate limiter error:", error.message);
      // Fail open if Redis goes down
      next();
    }
  };
};

export default rateLimiter;