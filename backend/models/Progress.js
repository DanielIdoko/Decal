import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
    overall: {
        type: Number,
        default: 0
    },
    dayProgress: {
        type: Number,
        default: 0
    },
    weekProgress: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress; 