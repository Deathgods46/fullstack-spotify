import { useEffect, useState } from 'react';
import { getMyPlaylists, Playlist } from '../../services/playlistsService';
import { useUserContext } from '../../context/userContext';

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { localStorageAuthToken } = useUserContext();

  useEffect(() => {
    if (!localStorageAuthToken) {
      return;
    }
    const fetchPlaylists = async () => {
      try {
        const data = await getMyPlaylists(localStorageAuthToken);
        setPlaylists(data.data.playlists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [localStorageAuthToken]);

  return <></>;
};

export default MyPlaylists;
