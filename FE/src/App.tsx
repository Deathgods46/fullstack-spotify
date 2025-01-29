import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { UserProvider } from './context/userContext';
import { SpotifyProvider } from './context/spotifyContext';

function App() {
  return (
    <SpotifyProvider>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </SpotifyProvider>
  );
}

export default App;
