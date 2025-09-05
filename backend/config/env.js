import { config } from "dotenv";

config({ path: '.env.local' })

const {
    NODE_ENV,
    PORT,
    MONGO_DB,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;


export { NODE_ENV, PORT, MONGO_DB, JWT_EXPIRES_IN, JWT_SECRET }