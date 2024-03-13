import mongoose, { Document, Schema } from 'mongoose';

// Define interface for User document
export interface IUserProfile extends Document {
    username: string;
    email: string;
    name: string;
    role: string;
    picture: string;
}


const userProfileSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['Super User', 'Product Lister', 'Visitor'], default: 'Visitor' },
    picture: { type: String }, // URL or binary data for the user's picture
    // Add more fields as needed
}, { timestamps: true });


export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
