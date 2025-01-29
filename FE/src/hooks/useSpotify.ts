import SpotifyWebApi from 'spotify-web-api-js';
import { useSpotifyContext } from '../context/spotifyContext';
import axios from 'axios';
import { get } from '../axios/apiService';
import { SongsTypes } from '../types/songsTypes';

const useSpotify = () => {
  const clientId: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID!;
  const clientSecret: string = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET!;
  const spotifyApi = new SpotifyWebApi();
  const { token, setToken } = useSpotifyContext();

  const initSpotify = async () => {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const newToken = response.data.access_token;
      setToken(newToken);
      spotifyApi.setAccessToken(newToken);
    } catch (error) {
      console.error('Error fetching Spotify token:', error);
    }
  };

  const getSongsFromSearchQuery = async (searchString: string) => {
    try {
      const url = 'https://api.spotify.com/v1/search';
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchString,
          type: 'track',
          limit: 10,
        },
      };

      const response = await get<{ tracks: { items: SongsTypes[] } }>(
        url,
        config,
      );
      return response.data.tracks.items;
    } catch (error) {
      console.error('Error fetching songs from Spotify:', error);
      return [];
    }
  };

  return { spotifyApi, initSpotify, getSongsFromSearchQuery };
};

export default useSpotify;
