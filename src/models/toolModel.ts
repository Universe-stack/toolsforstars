import mongoose, {Schema,Document} from 'mongoose';

//Next, Finish implement productType for page routing feature

export interface ITool extends Document{
    name: string,
    description: string,
    features: string,
    screenshots: string,
    pricing: string,
    productType:'app' | 'SAAS'| 'Course' ,
    categories: string,
    upvotes: number,
    upvotedBy:String[],
    targetAudience: string,
    isActive:boolean,
    reviews:String[],
    averageReview:number,
    createdAt: Date,
    updatedAt: Date,
    publisher: Schema.Types.ObjectId,
    publisherEmail: Schema.Types.ObjectId
}

const toolSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    features: {type: [String]},
    screenshots:{type: [String]},
    pricing: {type : String},
    productType: { type: String, enum: ['app', 'SAAS', 'Course'], default: 'app', required:true },
    categories: {type: String || [String]},
    upvotes:{type: Number, default: 0},
    upvotedBy: {type: [String]},
    targetAudience: {type: [String]},
    isActive: {type: Boolean, default: true},
    reviews: {type:Schema.Types.ObjectId, ref:'Review'},
    averageReview: {type:Number, default: 0},
    publisher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publisherEmail: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now}
})  

export default mongoose.model<ITool>('Tool', toolSchema)