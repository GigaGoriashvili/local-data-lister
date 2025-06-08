import { Router } from 'express';
import { getAllLocalItems } from '../controllers/localItemController';

const router = Router();

// GET /api/local-items
router.get('/', getAllLocalItems);

export default router;