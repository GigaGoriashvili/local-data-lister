import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import localItemRoutes from '../routes/localItemRoutes';
import { LocalItem } from '../models/localItem';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/local-items', localItemRoutes);

const MONGODB_TEST_URI = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/test_local_data_lister';
jest.mock('../models/localItem', () => ({
  LocalItem: {
    find: jest.fn(),
  },
}));

describe('Local Item API', () => {
  beforeAll(async () => {
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
  });

  it('should fetch all local items', async () => {
    const mockItems = [
      { _id: '1', name: 'Park A', type: 'Park', address: '123 Main', description: 'desc', tags: ['a'] },
      { _id: '2', name: 'Cafe B', type: 'Restaurant', address: '456 Oak', description: 'desc', tags: ['b'] },
    ];
    (LocalItem.find as jest.Mock).mockResolvedValue(mockItems);

    const res = await request(app).get('/api/local-items');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockItems);
    expect(LocalItem.find).toHaveBeenCalledTimes(1);
  });

  it('should handle server errors gracefully', async () => {
    (LocalItem.find as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/local-items');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toBe('Server Error');
  });
});