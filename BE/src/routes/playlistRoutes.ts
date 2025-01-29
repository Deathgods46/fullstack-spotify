import { Request, Response, Router } from 'express';
import {
  addSongToPlaylists,
  getUserPlaylists,
} from '../controllers/playlistsController';

const router = Router();

router.get('/getUserPlaylists', async (req: Request, res: Response) => {
  await getUserPlaylists(req, res);
});

router.post('/addSongToPlaylists', async (req: Request, res: Response) => {
  await addSongToPlaylists(req, res);
});

export default router;
