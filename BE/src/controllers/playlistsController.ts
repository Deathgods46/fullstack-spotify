import Playlist from '../models/Playlist';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || 'S0M3_$a|/|p|_3',
    ) as { id: string };

    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token', success: false });
    }

    const playlists = await Playlist.find({ user: decoded.id });

    if (!playlists.length) {
      return res
        .status(404)
        .json({ message: 'No playlists found', success: false });
    }

    const formattedPlaylists = playlists.map((playlist) => ({
      playlistName: playlist.name,
      songs: playlist.songs.map((song) => ({
        songId: song,
      })),
    }));

    res.json({
      message: 'Playlists fetched successfully',
      data: { playlists: formattedPlaylists },
      success: true,
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};
