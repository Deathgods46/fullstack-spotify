import { get } from '../axios/apiService';
import { ApiResponse } from '../types/apiTypes';

const GET_PLAYLISTS_ENDPOINT = '/playlists/my';

export interface Song {
	songId: string;
	songName: string;
	duration: number; // Duration in seconds
}

export interface Playlist {
	playlistName: string;
	songs: Song[];
}

export interface PlaylistResponse {
	playlists: Playlist[];
}

export const getMyPlaylists = async (): Promise<ApiResponse<PlaylistResponse>> => {
	try {
		const response = await get<ApiResponse<PlaylistResponse>>(GET_PLAYLISTS_ENDPOINT);
		return response.data;
	} catch (error) {
		throw error;
	}
};
