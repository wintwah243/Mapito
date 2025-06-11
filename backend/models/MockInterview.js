import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema({
    role: String,
    answer: String,
    history: String,
    response: String,
    source: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);
export default MockInterview;