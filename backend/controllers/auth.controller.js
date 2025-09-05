import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from '../config/env.js';


// Utils function to help filter out important details from our user data
const filterUserDetails = (user) => {
    const { password, __v, ...info } = user._doc
    return info
}

export const Register = async (req, res, next) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const { email, name, password } = req.body
        const user = await User.find({ email });

        if (user) {
            res.status(400).json({
                success: false,
                message: "Sorry, that user already exists. Create a new account or login."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.insertOne({ name, email, password: hashedPassword });

        if (!newUser) {
            res.status(500).json({
                success: false,
                error: "Error creating new user. Please try again."
            })
        }

        const userInfo = filterUserDetails(newUser)

        res.status(200).json({
            success: true,
            message: "Account Created Successfully!",
            data: userInfo
        })

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
        await session.abortTransaction();
        session.endSession();
    }
}


// login user
export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                error: "User account Not found. Try creating one."
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({
                success: false,
                error: "Password is invalid. Please try again."
            })
        }

        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email },
            JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        const userInfo = filterUserDetails(user);

        // Created a cookie so that we can access the user info from the frontend in a safer way 
        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV || "development",
            sameSite: "strict",
            expires: new Date(Date.now + 1000 * 60 * 24)
        }).status(200).json({
            success: true,
            token, userInfo
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// SignOut/Logout User
export const Logout = async (params) => {
    try {
        res.clearCookie("token", {
            sameSite: "None",
            secure: true
        }).status(200).json({
            success: true,
            message: "User Logged out Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
