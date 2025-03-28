export const LANDING_PAGE = '/';
export const DASHBOARD_PAGE = '/home';
export const SEARCH_SONGS = '/home/search-songs';
export const MY_PLAYLISTS = '/home/my-playlists';

export const getPlaylistPageFromId = (playlistId: string) => {
  return `${MY_PLAYLISTS}/${playlistId}`;
};
