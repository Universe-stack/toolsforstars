import mongoose, {Schema,Document} from 'mongoose';


export interface ITool extends Document{
    name: string,
    description: string,
    features: string,
    screenshots: string,
    logo: string,
    pricing: number,
    productType:'app' | 'saas'| 'course' ,
    categories: string[],
    productLink:string,
    youtubeLink:string,
    upvotes: number,
    upvotedBy:Schema.Types.ObjectId[],
    targetAudience: string,
    isActive:boolean,
    reviews:String[],
    averageReview:number,
    aiEnabled:boolean,
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
    logo:{type: [String]},
    pricing: {type : Number, default:0},
    productType: { type: String, enum: ['app', 'saas', 'course'], default: 'app', required:true },
    categories: {type: [String] },
    productLink:{type: String, required: true},
    youtubeLink:{type: String, required: true},
    upvotes:{type: Number, default: 0},
    upvotedBy: {type: [Schema.Types.ObjectId]},
    targetAudience: {type: [String]},
    isActive: {type: Boolean, default: true},
    reviews: {type:Schema.Types.ObjectId, ref:'Review'},
    averageReview: {type:Number, default: 0},
    aiEnabled: {type:Boolean, default:false},
    publisher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publisherEmail: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type:Date, default: Date.now},
    updatedAt: {type:Date, default: Date.now}
})  

export default mongoose.model<ITool>('Tool', toolSchema)