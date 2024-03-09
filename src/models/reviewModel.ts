import mongoose,{Schema, Document} from "mongoose";

interface IReview extends Document {
    toolId: String,
    userId: String,
    content: String,
    createdAt: Date,
    updatedAt: Date
}

const reviewSchema = new Schema({
    toolId: {type: Schema.Types.ObjectId, ref: 'Tool', required:'true'}
})


export default mongoose.model<IReview>('Review', reviewSchema)