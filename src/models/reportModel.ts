import mongoose, { Schema, Document } from 'mongoose';

interface IReportedTool extends Document {
    tool: mongoose.Types.ObjectId;
    reportcase: string;
    user: mongoose.Types.ObjectId | null;
    createdAt: Date;
}

const ReportedToolSchema: Schema = new Schema({
    tool: { type: Schema.Types.ObjectId, ref: 'Tool', required: true },
    reportcase: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model<IReportedTool>('ReportedTool', ReportedToolSchema);

