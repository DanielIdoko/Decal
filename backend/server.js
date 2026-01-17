import express from "express";
import { PORT } from "./src/config/env.config.js";
import { connectDB } from "./src/database/db.js";

const app = express();

app.listen(PORT, async () => {
  console.log(`App running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
