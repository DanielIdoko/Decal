import mongoose from 'mongoose';
import { MONGO_DB } from '../config/env.js';


// // error if no database URI is found
if (!MONGO_DB) {
    throw new Error("Please include the DB_URI environment variable inside the .env file")
}

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_DB);
        console.log("Connected to Database in development mode");
    } catch (err) {
        console.log("An error occured while connecting to the database", err);
        process.exit(1);
    }
}

export default connectToDB;