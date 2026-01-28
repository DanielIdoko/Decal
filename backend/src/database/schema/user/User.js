import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      firstName: String,
      lastName: String,
      age: Number | string,
      gender: {
        type: String,
        enum: ["male", "female"],
      },
      height: Number, // in cm
      startingWeight: Number, // in kg
      currentWeight: Number, // in kg
      goalWeight: Number, // in kg
      profileImage: String,
    },
    nutrition: {
      dailyCalorieGoal: {
        type: Number,
        default: 2000,
      },
      macroGoals: {
        protein: Number, // grams
        carbs: Number,
        fat: Number,
      },
    },
    streaks: {
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastActiveDate: Date,
    },
    weightHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        weight: Number, // in kg
      },
    ],
  },
  { timestamps: true },
);

export default User = mongoose.model("User", userSchema);
