import Playlist from '../models/Playlist';
import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User from '../models/User';

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
      id: playlist._id,
    }));

    res.json({
      message: 'Playlists fetched successfully',
      data: { playlists: formattedPlaylists },
      success: true,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }

    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const addSongToPlaylists = async (req: Request, res: Response) => {
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

    const { songId, playlistsId } = req.body;
    const updatedPlaylists = await Playlist.updateMany(
      {
        _id: { $in: playlistsId },
        user: decoded.id,
      },
      {
        $addToSet: { songs: songId },
      },
    );

    if (updatedPlaylists.modifiedCount === 0) {
      return res.status(404).json({ message: 'No playlists were updated.' });
    }

    return res
      .status(200)
      .json({ message: 'Song added to selected playlists.', success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }
    return res
      .status(500)
      .json({ message: 'Server error, please try again later.' });
  }
};

export const removeSongFromPlaylist = async (req: Request, res: Response) => {
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

    const { songId, playlistId } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: songId } },
      { new: true },
    );

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' });
    }

    return res
      .status(200)
      .json({ message: 'Song removed successfully', playlist, success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }
    return res
      .status(500)
      .json({ message: 'Server error, please try again later.' });
  }
};

export const removePlaylist = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || 'S0M3_$a|/|p|_3',
      ) as { id: string };
    } catch (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired token', success: false });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token', success: false });
    }

    const { playlistId } = req.body;

    if (!playlistId) {
      return res
        .status(400)
        .json({ success: false, message: 'Playlist ID is required' });
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this playlist',
      });
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete the playlist, please try again later',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
    });
  } catch (error) {
    console.error('Error during playlist deletion:', error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }

    return res.status(500).json({
      message: 'Server error, please try again later.',
      success: false,
    });
  }
};

export const handleCreatePlaylist = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || 'S0M3_$a|/|p|_3',
      ) as { id: string };
    } catch (err) {
      return res
        .status(401)
        .json({ message: 'Invalid or expired token', success: false });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token', success: false });
    }
    const { playlistName } = req.body;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const newPlaylist = new Playlist({
      name: playlistName,
      user: decoded.id,
      songs: [],
    });

    await newPlaylist.save();

    return res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
    });
  } catch (error) {
    console.error('Error during playlist creation:', error);
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'Token has expired, please login again',
        });
    }

    return res.status(500).json({
      message: 'Server error, please try again later.',
      success: false,
    });
  }
};
