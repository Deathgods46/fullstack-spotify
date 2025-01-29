import {Request, Response, Router} from "express";
import {authenticate} from "../middleware/auth";
import {getUserPlaylists} from "../controllers/playlistsController";

const router = Router();

router.get('/playlist/getUserPlaylists', authenticate, async (req: Request, res: Response) => {
    await getUserPlaylists(req, res);
});