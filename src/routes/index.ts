import { Router } from 'express';
import { generatePlaceholder } from '../controllers/placeholderController';

export const router = Router();

// Single route with query parameters
router.get('/', generatePlaceholder);
