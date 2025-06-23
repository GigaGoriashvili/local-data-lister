import { Request, Response } from 'express';
import { LocalItem } from '../models/localItem'; // Import the LocalItem model

export const getAllLocalItems = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;
    const items = await LocalItem.find().skip(skip).limit(limit); // Fetch paginated items from MongoDB
    res.json(items);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};