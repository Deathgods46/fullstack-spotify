import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, (req: Request, res: Response) => {
  res.json({ message: 'Get all songs' });
});

router.get('/:id', authenticate, (req: Request, res: Response) => {
  res.json({ message: `Get songs with ID: ${req.params.id}` });
});

router.post('/', authenticate, (req: Request, res: Response) => {
  res.json({ message: 'Create a new song entry', data: req.body });
});

export default router;
