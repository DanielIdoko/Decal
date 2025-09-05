import express from 'express';
import cors from 'cors'
import { PORT } from './config/env.js'
import connectToDB from './database/database.js';
import authRouter from './routes/auth.route.js';
import workoutRouter from './routes/workout.route.js';


const app = express();

// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))

// Routes
app.use("/api/auth", authRouter)
app.use("/api/workouts", workoutRouter)

app.listen(PORT, async () =>{
    console.log(`Backend successfully running on http://localhost:${PORT}`);
    await connectToDB();  
})