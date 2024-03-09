import mongoose, {Schema, Document} from 'mongoose';

interface IUpvote extends Document {
    toolId: String,
    userId: String,
    createdAt: Date
}

const upvoteSchema = new Schema({
    toolId: {type: Schema.Types.ObjectId, ref:'Tool', required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User', required:true},
    createdAt: {type:Date, default: Date.now }
})


export default mongoose.model<IUpvote>('Upvote',upvoteSchema)