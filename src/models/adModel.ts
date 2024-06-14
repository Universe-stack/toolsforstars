import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
    title: string;
    description: string;
    link:String;
    price: number;
    image: string;
    adSpace: 'hero-pro' | 'hero-mid' | 'hero-end' | 'saas-pro' | 'saas-mid' | 'saas-end' | 'none';
    publisher: Schema.Types.ObjectId;
    paid: boolean;
    startingDate:string;
    campaignBudget:number;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

const adSchema = new Schema<IAd>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link:{ type: String, required: true },
    price: { type: Number, required: true },
    image: {type: String, required: true},
    adSpace: { type: String, enum: ['hero-pro', 'hero-mid', 'hero-end', 'saas-pro', 'saas-mid', 'saas-end', 'none'], default: 'none' },
    publisher: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    paid: { type: Boolean},
    startingDate: { type: String},
    campaignBudget: {type: Number},
    duration: { type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAd>('Ad', adSchema);