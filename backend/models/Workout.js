import mongoose from 'mongoose';


const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: String,
    desc: String,
    duration: Number,
    calories: Number,
    date: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const Workout = mongoose.model("Workout", workoutSchema)
export default Workout