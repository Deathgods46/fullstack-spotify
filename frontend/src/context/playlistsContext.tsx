import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getMyPlaylists, Playlist } from '../services/playlistsService';
import { useUserContext } from './userContext';

// Define the shape of the context data
interface PlaylistsContextType {
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  fetchLatestPlaylists: () => Promise<void>;
  loadingPlaylistsData: boolean;
}

// Create the context
const PlaylistsContext = createContext<PlaylistsContextType | undefined>(
  undefined,
);

interface PlaylistsProviderProps {
  children: ReactNode;
}

// Provider component
export const PlaylistsProvider: React.FC<PlaylistsProviderProps> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylistsData, setLoadingPlaylistsData] = useState(false);
  const { user } = useUserContext();

  const fetchLatestPlaylists = async () => {
    setLoadingPlaylistsData(true);
    getMyPlaylists().then((data) => {
      setPlaylists(data.data?.playlists || []);
      setLoadingPlaylistsData(false);
    });
  };

  useEffect(() => {
    if (user?.authToken) {
      fetchLatestPlaylists();
    }
  }, [user?.authToken]);

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        setPlaylists,
        fetchLatestPlaylists,
        loadingPlaylistsData,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylistsContext = (): PlaylistsContextType => {
  const context = useContext(PlaylistsContext);
  if (!context) {
    throw new Error('usePlaylists must be used within a PlaylistsProvider');
  }
  return context;
};
