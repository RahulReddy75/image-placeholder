import { Router } from 'express';
import { generatePlaceholderImage, validateParams } from '../services/placeholder.service';

export const router = Router();

// Single route with query parameters
router.get('/', async (req, res) => {
  try {
    const params = validateParams(req.query);
    const buffer = await generatePlaceholderImage(params);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid parameters',
        details: error.message,
      });
      return;
    }
    throw error;
  }
});
