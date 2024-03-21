import mongoose,{Schema, Document} from "mongoose";

interface IReview extends Document {
    toolId: String,
    userId: String,
    content: String,
    reviewstars: number
    createdAt: Date,
    updatedAt: Date
}

const reviewSchema = new Schema({
    toolId: {type: Schema.Types.ObjectId, ref: 'Tool', required:'true'},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required:'true'},
    content: {type: String},
    reviewstars: {type: Number, default: 0}
})


export default mongoose.model<IReview>('Review', reviewSchema)