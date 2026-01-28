import express from "express";
import { CORS_ORIGIN, NODE_ENV, PORT } from "./config/env.config.js";
import cookieParser from "cookie-parser";
import connectToDb from "./database/db.js";
import cors from "cors";
import rateLimiter from "./middleware/rate-limiter/rateLimiter.js";
import morgan from "morgan";
// import { logger } from "./logger";
import helmet from 'helmet'
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";

const app = express();

// MIDDLEWARES
// Morgan middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// HELMET
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
  })
);



app.use(cookieParser());
app.use(express.json({ extended: false }));
app.use(rateLimiter());

// CORS
app.use(
  cors({
    origin: [CORS_ORIGIN],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);


// clerk
app.use(clerkMiddleware());
// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get("/api/v1/protected", requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req);

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  return res.status(200).json({
    success: true,
    data: user,
  });
});


// Run server
app.listen(PORT, async () => {
  console.log(`App running on http://localhost:${PORT} in ${NODE_ENV} mode`);
  await connectToDb();
});