import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/userContext';
import { SpotifyProvider } from './context/spotifyContext';
import { PlaylistsProvider } from './context/playlistsContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <SpotifyProvider>
      <UserProvider>
        <PlaylistsProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </PlaylistsProvider>
      </UserProvider>
    </SpotifyProvider>
  );
}

export default App;
