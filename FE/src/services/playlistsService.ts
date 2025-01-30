import { del, get, post } from '../axios/apiService';

import {
  AddSongToPlaylistsPayload,
  ApiResponse,
  RemoveSongFromCurrentPlaylistPayload,
} from '../types/apiTypes';
import {
  addPlaylist,
  addSongToPlaylist,
  getPlaylistsEndpoint,
  removePlaylist,
  removeSongFromPlaylist,
} from '../api/apiRoutes';
import { toast } from 'react-hot-toast';

export interface Song {
  songId: string;
  songName: string;
  duration: number; // Duration in seconds
}

export interface Playlist {
  id: string;
  playlistName: string;
  songs: Song[];
}

export interface PlaylistResponse {
  playlists: Playlist[];
}

export const getMyPlaylists = async (): Promise<
  ApiResponse<PlaylistResponse>
> => {
  try {
    const response = await get<ApiResponse<PlaylistResponse>>(
      getPlaylistsEndpoint,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSongIdToPlaylists = async (
  payload: AddSongToPlaylistsPayload,
) => {
  const response = await post<ApiResponse<{}>, AddSongToPlaylistsPayload>(
    addSongToPlaylist,
    payload,
  );
  if (response.data.success) {
    toast.success(response.data.message);
  }
};

export const removeSongFromCurrentPlaylist = async (
  payload: RemoveSongFromCurrentPlaylistPayload,
) => {
  const response = await del<{ success: boolean; message: string }>(
    removeSongFromPlaylist,
    {
      data: payload,
    },
  );

  if (response.data.success) {
    toast.success(response.data.message);
  } else {
    toast.error('Something failed while deleting!');
  }
};

export const handleDeletePlaylist = async (payload: { playlistId: string }) => {
  if (!payload.playlistId) {
    toast.error('Playlist Id is missing!');
    return;
  }
  const response = await del<{ success: boolean; message: string }>(
    removePlaylist,
    { data: payload },
  );

  if (response.data.success) {
    toast.success(response.data.message);
  } else {
    toast.error('Something failed while deleting!');
  }
};

export const handleCreatePlaylist = async (payload: {
  playlistName: string;
}) => {
  if (!payload.playlistName) {
    toast.error('Playlist Name is missing!');
    return;
  }

  const response = await post<
    ApiResponse<{}>,
    {
      playlistName: string;
    }
  >(addPlaylist, { playlistName: payload.playlistName });

  if (response.data.success) {
    toast.success(response.data.message);
  } else {
    toast.error('Something failed while creating a new playlist!');
  }
};
