import { User } from './userTypes';
import { Playlist } from '../services/playlistsService';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface AddSongToPlaylistsPayload {
  songId: string;
  playlistsId: string[];
}

export interface RemoveSongFromCurrentPlaylistPayload {
  playlistId: string;
  songId: string;
}
