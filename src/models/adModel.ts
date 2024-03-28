import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
    title: string;
    description: string;
    price: number;
    publisher: Schema.Types.ObjectId;
    purchaseLink:String;
    paymentStatus: 'pending' | 'paid' | 'rejected';
    adSpace: 'hero-pro' | 'hero-mid' | 'hero-end' | 'saas-pro' | 'saas-mid' | 'saas-end' | 'none';
    createdAt: Date;
    updatedAt: Date;
}

const adSchema = new Schema<IAd>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    publisher: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    purchaseLink:{ type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
    adSpace: { type: String, enum: ['hero-pro', 'hero-mid', 'hero-end', 'saas-pro', 'saas-mid', 'saas-end', 'none'], default: 'none' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAd>('Ad', adSchema);