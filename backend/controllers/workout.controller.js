import Workout from '../models/Workout.js';



// Create a workout
export const CreateWorkout = async (req, res, next) => {
    try {
        const { type, desc, duration, calories } = req.body;
        const workout = await Workout.findOne({ type })
        if (workout) {
            res.status(400).json({
                success: false,
                error: "A workout with that name already exists. Try something else."
            })
        }
        const newWorkout = await Workout.insertOne({ type, desc, duration, calories });

        if (!newWorkout) {
            res.status(500).json({
                success: false,
                error: "Failed to create new workout. Please try again."
            })
        }

        res.status(200).json({
            success: true,
            message: "New workout created Successfully",
            data: newWorkout
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// Get all workouts
export const GetWorkouts = async (req, res, next) => {
    try {
        const workouts = await Workout.find();

        if (!workouts) {
            res.status(200).json({
                success: true,
                message: "No workouts found. Try creating one",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            data: workouts
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


// Get Workout
export const GetWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            res.status(404).json({
                success: false,
                error: "That workout may have been deleted or not yet created. Create one"
            })
        }
        res.status(200).json({
            success: true,
            data: workout,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


// update Workout
export const UpdateWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true });

        if (!workout) {
            res.status(500).json({
                success: true,
                error: "Failed to update that workout. Please Try again.",
            })
        }

        res.status(200).json({
            success: true,
            data: workout,
            message: "Workout updated Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// Delete All workouts
export const DeleteWorkouts = async (req, res, next) => {
    try {
        const workouts = await Workout.deleteMany();

        if (!workouts) {
            res.status(200).json({
                success: true,
                error: "Error deleting workouts. Try again."
            })
        }

        res.status(200).json({
            success: true,
            message: "Workouts successfully deleted",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


// Delete a single workout
export const DeleteWorkout = async (req, res, next) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);

        if (!workout) {
            res.status(200).json({
                success: true,
                error: "Error deleting workout. Try again."
            })
        }

        res.status(200).json({
            success: true,
            message: "Workout successfully deleted",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}