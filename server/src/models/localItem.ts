import { Document, Schema, model } from 'mongoose';

// Interface for a LocalItem document (including Mongoose's Document properties)
export interface ILocalItem extends Document {
    name: string;
    type: 'Restaurant' | 'Park' | 'Event' | string; // Or a more generic string
    address: string;
    description: string;
    tags: string[];
}

// Mongoose Schema definition
const LocalItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] } // Array of strings, defaults to empty
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Mongoose model for LocalItem
export const LocalItem = model<ILocalItem>('LocalItem', LocalItemSchema);