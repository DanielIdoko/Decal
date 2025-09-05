import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        lowercase: true,
        minLength: 2,
        maxLength: 55
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        minLength: 2,
        unique: true,
        match: [/\S+\@\S+\.\S+/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6
    },
    weight: Number,
    goals: String,
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    age: Number
}, {timestamps: true})

const User = mongoose.model("User", userSchema)
export default User;