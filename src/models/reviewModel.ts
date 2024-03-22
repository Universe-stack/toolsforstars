import mongoose,{ Document, Schema, Types } from 'mongoose';

interface IReview extends Document {
    toolId: Types.ObjectId,
    userId: Types.ObjectId,
    reviewContent: string,
    reviewStars: number,
    createdAt: Date,
    updatedAt: Date
}

const reviewSchema = new Schema({
    toolId: { type: Schema.Types.ObjectId, ref: 'Tool', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewContent: { type: String, required: true },
    reviewStars: { type: Number, default: 0 },
    averageReview: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', reviewSchema);