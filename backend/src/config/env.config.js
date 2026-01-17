import dotenv from "dotenv";

dotenv.config({ path: `././.env.${process.env.NODE_ENV || "development"}` });

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;
