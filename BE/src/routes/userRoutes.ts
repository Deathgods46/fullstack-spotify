import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllUsers,
  getUserByToken,
  loginUser,
  registerUser,
} from '../controllers/userController';

const router = Router();

// Get all users - protected route
router.get('/getAllUsers', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.post('/loginUser', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

router.post('/addUser', async (req: Request, res: Response) => {
  await registerUser(req, res);
});

router.get('/getMe', async (req: Request, res: Response) => {
  await getUserByToken(req, res);
});

export default router;
