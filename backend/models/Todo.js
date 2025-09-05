import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    todoProgress: Number,
    todoTitle: {
        type: String,
        required: [true, "Todo title is required"],
        lowercase: true,
        trim: true,
        minLength: 2
    },
    todoBody: {
        type: String,
        required: [true, "Todo body is required"],
        minLength: 2
    },
    todoCategories: {
        type: [String],
    }
}, {timestamps: true});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo; 