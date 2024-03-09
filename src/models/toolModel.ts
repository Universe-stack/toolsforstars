import mongoose, {Schema,Document} from 'mongoose';

export interface ITool extends Document{
    name: String,
    description: String,
    features: String,
    screenshots: String,
    pricing: String,
    categories: String,
    targetAudience: String,
    createdAt: Date,
    updatedAt: Date
}

const toolSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    features: {type: [String]},
    screenshots:{type: [String]},
    pricing: {type : String},
    categories: {type: [String]},
    targetAudience: {type: [String]},
    productLister: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now}
})

export default mongoose.model<ITool>('Tool', toolSchema)