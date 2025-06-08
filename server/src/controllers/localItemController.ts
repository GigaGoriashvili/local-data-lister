import { Request, Response } from 'express';
import { LocalItem } from '../models/localItem'; // Import the LocalItem model

export const getAllLocalItems = async (req: Request, res: Response) => {
  try {
    const items = await LocalItem.find(); // Fetch all items from MongoDB
    res.json(items);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};