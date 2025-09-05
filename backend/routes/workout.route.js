import { Router } from "express";
import { CreateWorkout, GetWorkout, GetWorkouts, UpdateWorkout } from "../controllers/workout.controller.js";


const workoutRouter = Router();

workoutRouter.post("/create-workout", CreateWorkout)
workoutRouter.get("/", GetWorkouts)
workoutRouter.get("/:id", GetWorkout)
workoutRouter.put("/:id", UpdateWorkout)
workoutRouter.delete("/:id", )
workoutRouter.delete("/", )

export default workoutRouter;