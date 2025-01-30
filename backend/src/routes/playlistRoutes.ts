import { Request, Response, Router } from 'express';
import {
  addSongToPlaylists,
  getUserPlaylists,
  handleCreatePlaylist,
  removePlaylist,
  removeSongFromPlaylist,
} from '../controllers/playlistsController';

const router = Router();

router.get('/getUserPlaylists', async (req: Request, res: Response) => {
  await getUserPlaylists(req, res);
});

router.post('/addSongToPlaylists', async (req: Request, res: Response) => {
  await addSongToPlaylists(req, res);
});

router.delete(
  '/removeSongFromPlaylist',
  async (req: Request, res: Response) => {
    await removeSongFromPlaylist(req, res);
  },
);
router.delete('/removePlaylist', async (req: Request, res: Response) => {
  await removePlaylist(req, res);
});

router.post('/addPlaylist', async (req: Request, res: Response) => {
  await handleCreatePlaylist(req, res);
});

export default router;
