import express from "express";
import { CORS_ORIGIN, NODE_ENV, PORT } from "./src/config/env.config.js";
// import cookieParser from "cookie-parser";
import { connectDB } from "./src/database/db.js";

const app = express();

// Run server
app.listen(PORT, async () => {
  console.log(`App is running on http://localhost:${PORT} in ${NODE_ENV} mode`);
  await connectDB();
});