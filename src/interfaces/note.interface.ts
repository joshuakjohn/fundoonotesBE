import { Document, Types } from 'mongoose';

export interface INote extends Document {
    title: string;
    description: string;
    color?: string;           // Optional field (because required: false in schema)
    isArchive: boolean;
    isTrash: boolean;
    createdBy: Types.ObjectId; // ObjectId type from mongoose
}