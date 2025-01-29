import { get, post } from '../axios/apiService';

import {
  AddSongToPlaylistResponse,
  AddSongToPlaylistsPayload,
  ApiResponse,
} from '../types/apiTypes';
import { addSongToPlaylist, getPlaylistsEndpoint } from '../api/apiRoutes';
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

export const getMyPlaylists = async (
  token: string,
): Promise<ApiResponse<PlaylistResponse>> => {
  try {
    const response = await get<ApiResponse<PlaylistResponse>>(
      getPlaylistsEndpoint,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSongIdToPlaylists = async (
  payload: AddSongToPlaylistsPayload,
) => {
  const response = await post<
    ApiResponse<AddSongToPlaylistResponse>,
    AddSongToPlaylistsPayload
  >(addSongToPlaylist, payload);
  if (response.data.success) {
    toast.success(response.data.message);
  }
};
