// Interface for a LocalItem as consumed by the frontend
export interface LocalItem {
    _id: string; // MongoDB's default ID, will be a string on frontend
    name: string;
    type: 'Restaurant' | 'Park' | 'Event' | string;
    address: string;
    description: string;
    tags: string[];
    createdAt?: string;
    updatedAt?: string; 
}