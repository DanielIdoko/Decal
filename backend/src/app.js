import app from "../server.js";
import cors from "cors";
import rateLimiter from "./src/middleware/rate-limiter/rateLimiter.js";
import morgan from "morgan";
import helmet from 'helmet'
import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";


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

// app.use(cookieParser());
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



// Clerk
app.use(clerkMiddleware());

app.get("/api/v1/*", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  const user = await clerkClient.users.getUser(userId);

  return res.status(200).json({
    success: true,
    data: user,
  });
});


// Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Nutrition App API running successfully!",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});
